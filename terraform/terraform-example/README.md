# BUILD INFRASTRUCUTRE
Start by making a main.tf file, make sure you make this in its own directory and execute commands on the same path as this file or direct the -f to this file path
the basic config for setting up the provider for google
```hcl
provider "google" {
  version = "3.5.0"

  credentials = file("<NAME>.json")

  project = "<PROJECT_ID>"
  region  = "us-central1"
  zone    = "us-central1-c"
}

resource "google_compute_network" "vpc_network" {
  name = "terraform-network"
}
```
then execute initialization
```bash
terraform init
# and initialize resources
terraform apply
# get info on resources
terraform show
```

# Adding Resources
This is in the same main.tf file

Here we are adding an instance with its type, the associated boot disk needed to boot the instance, and the attached network.
```hcl
resource "google_compute_instance" "vm_instance" {
  name         = "terraform-instance"
  machine_type = "f1-micro"

  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-9"
    }
  }

  network_interface {
    network = google_compute_network.vpc_network.name
    access_config {
    }
  }
}
```
Now apply this
```bash
terraform apply
```

# Appling Changes
simply make the changes to the same file and run
```bash
terraform apply
```
Changes are updated in place for items with the symbol `~`

# Destructive Changes
Some times changes will replace instead of update. This happens when the provider cannot replace the change you have described in the file. For instance a disk type change. You cannot just update the disk type from debian-cloud/debian-9 to cos-cloud/cos-stable.

Replacements have the prefix `-/+`

# Destroy Infrustructure
Destroy the described infrustructre in the file
```bash
terraform destroy
```

# Resource Dependencies
You can have resources that span multiple providers. Also intermixing of resources.

Static IP to a VM
```hlc
resource "google_compute_address" "vm_static_ip" {
  name = "terraform-static-ip"
}
# update the resource "google_compute_instance" "vm_instance" 
#  network_interface {
#    network = google_compute_network.vpc_network.self_link
#    access_config {
#      nat_ip = google_compute_address.vm_static_ip.address
#    }
#  }
```
This will ensure vm_static_ip is created before the vm_instance, save the properties of vm_static_ip in the state and set nat_ip to the value of the vm_static_ip.address property

After the changes you can run plan and save the changes to see what the execution will be
```bash
terraform plan -out static_ip
```
Saveing the plan lets us apply the same plan again in the future with
```bash
terraform apply "static_ip"
```

# Implicit and Explicit Dependencies
For example, perhaps an application we will run on our instance expects to use a specific Cloud Storage bucket, but that dependency is configured inside the application code and thus not visible to Terraform. In that case, we can use depends_on to explicitly declare the dependency.

Add a Cloud Storage bucket and an instance with an explicit dependency on the bucket by adding the following to main.tf.
```hcl
# New resource for the storage bucket our application will use.
resource "google_storage_bucket" "example_bucket" {
  name     = "<UNIQUE-BUCKET-NAME>"
  location = "US"

  website {
    main_page_suffix = "index.html"
    not_found_page   = "404.html"
  }
}

# Create a new instance that uses the bucket
resource "google_compute_instance" "another_instance" {
  # Tells Terraform that this VM instance must be created only after the
  # storage bucket has been created.
  depends_on = [google_storage_bucket.example_bucket]

  name         = "terraform-instance-2"
  machine_type = "f1-micro"

  boot_disk {
    initialize_params {
      image = "cos-cloud/cos-stable"
    }
  }

  network_interface {
    network = google_compute_network.vpc_network.self_link
    access_config {
    }
  }
}
```
Note: Google storage buckets must be globally unique. 

Then you can run `terraform plan` and `terraform apply` to see the changes.

# Provision
Packer by Hashicorp - Good for provisioning instances if you're not using containerized applications.

But here you can see terraform has a provisioner field that allows shell scripting, uploading files, install, and trigger other software.
```hcl
resource "google_compute_instance" "vm_instance" {
  name         = "terraform-instance"
  machine_type = "f1-micro"
  tags         = ["web", "dev"]

  # local exec runs the command locally on the machine
  provisioner "local-exec" {
    command = "echo ${google_compute_instance.vm_instance.name}:  ${google_compute_instance.vm_instance.network_interface[0].access_config[0].nat_ip} >> ip_address.txt"
  }

  # ...
}
```
You can have multiple provision blocks to describe multiple actions.

Provisioners are only run on resource creation. To restart/recreate the resource run
```bash
terraform taint google_compute_instance.vm_instance
```
That should get the ball rolling. But also recreate your work. soo watch out.

You can also create provisioners that only run on destroy.

# Input Variables
You can use input variables to make your deployment more agnostic.

You can change the zone, project name, and other things this way.

Create a variables.tf file
```hcl
variable "project" { }

variable "credentials_file" { }

variable "region" {
  default = "us-central1"
}

variable "zone" {
  default = "us-central1-c"
}
```
Then You can use these variables in a config
```hcl
provider "google" {
  version = "3.5.0"

  credentials = file(var.credentials_file)

  project = var.project
  region  = var.region
  zone    = var.zone
}
```
You can also set variables direclty on the cmd
```bash
terraform plan -var 'project=<PROJECT_ID>'
```
You can also use from a file. Create a file terraform.tfvars
```hcl
project = "<PROJECT_ID>"
credentials_file = "<NAME>.json"
```
Terraform auto loads .tfvars and *.auto.tfvars present in the current directory or load the file 
```bash
terraform apply \
  -var-file="secret.tfvars" \
  -var-file="production.tfvars"
```
There are also Terraform environment variables. As Such `TF_VAR_name` so you could set the `region` as so... `TF_VAR_region` = to something.

For variables you should set the type otherwise it assumes string
```hcl
variable "web_instance_count" {
  type    = number
  default = 1
}
# lists
variable "cidrs" { default = [] }
# maps
variable "environment" {
  type    = string
  default = "dev"
}

variable "machine_types" {
  type    = map
  default = {
    dev  = "f1-micro"
    test = "n1-highcpu-32"
    prod = "n1-highcpu-32"
  }
}
```

# Output Variables
You can also output variables from terraform
```hcl
output "ip" {
  value = google_compute_address.vm_static_ip.address
}
```
Then run
```bash
terraform refresh
google_compute_network.vpc_network: Refreshing state... [id=terraform-network]
google_compute_address.vm_static_ip: Refreshing state... [id=orbital-avatar-247819/us-central1/terraform-static-ip]
google_compute_instance.vm_instance: Refreshing state... [id=terraform-instance]

Outputs:

ip = 35.192.68.38
```
And now you can run 
```bash
terraform output
``` 
and get `ip = 105.154.236.90`

# Modules
Reusable pieces of terraform. Good for teams and organization.
```hcl
module "network" {
  source  = "terraform-google-modules/network/google"
  version = "2.0.2"

  network_name = "terraform-vpc-network"
  project_id   = var.project

  subnets = [
    {
      subnet_name   = "subnet-01"
      subnet_ip     = var.cidrs[0]
      subnet_region = var.region
    },
    {
      subnet_name   = "subnet-02"
      subnet_ip     = var.cidrs[1]
      subnet_region = var.region

      subnet_private_access = "true"
    },
  ]

  secondary_ranges = {
    subnet-01 = []
    subnet-02 = []
  }
}
```