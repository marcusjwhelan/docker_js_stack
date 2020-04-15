# Init
Download google skd - be in administrator
```bash
gcloud init
```

# Init project
Create new admin project
```bash
gcloud projects create ${PROJECT_NAME} \
  --organization ${YOUR_ORG_ID} \
  --set-as-default
```
Link billing
```bash
gcloud beta billing projects link ${PROJECT_NAME} \
  --billing-account ${YOUR_BILLING_ACCOUNT_ID}
```
Create IAM service-account for terraform
```bash
gcloud iam service-accounts create terraform --display-name "Terraform admin account"
```
Then add roles to service account
```bash
gcloud projects add-iam-policy-binding ${PROJECT_NAME} \
  --member serviceAccount:terraform@${PROJECT_NAME}.iam.gserviceaccount.com \
  --role roles/container.admin
gcloud projects add-iam-policy-binding ${PROJECT_NAME} \
  --member serviceAccount:terraform@${PROJECT_NAME}.iam.gserviceaccount.com \
  --role roles/compute.admin
gcloud projects add-iam-policy-binding ${PROJECT_NAME} \
  --member serviceAccount:terraform@${PROJECT_NAME}.iam.gserviceaccount.com \
  --role roles/storage.admin
gcloud projects add-iam-policy-binding ${PROJECT_NAME} \
  --member serviceAccount:terraform@${PROJECT_NAME}.iam.gserviceaccount.com \
  --role roles/iam.serviceAccountUser
gcloud projects add-iam-policy-binding ${PROJECT_NAME} \
  --member serviceAccount:terraform@${PROJECT_NAME}.iam.gserviceaccount.com \
  --role roles/resourcemanager.projectIamAdmin
# OR
gcloud projects add-iam-policy-binding ${PROJECT_NAME} \
  --member serviceAccount:terraform@${PROJECT_NAME}.iam.gserviceaccount.com \
  --role roles/editor
```
Get Credentials for IAM account
```bash
gcloud iam service-accounts keys create "./creds/google/terraform.json" --iam-account terraform@${PROJECT_NAME}.iam.gserviceaccount.com
```

To use your own gcloud credentials for terraform
```bash
gcloud auth application-default login
```
Saved at 

C:\Users\hmwksadmin\AppData\Roaming\gcloud\application_default_credentials.json

Now we have to create a bucket for the Terraform state
```bash
gsutil mb -p ${PROJECT_NAME} -c regional -l us-west1 gs://${BUCKET_NAME}
```
Once we have our bucket, we can activate object versioning to allow for state recovery in the case of accidental deletions and human error
```bash
gsutil versioning set on gs://${BUCKET_NAME}
```
Now grant read write versioning to the bucket to our service account
```bash
gsutil iam ch serviceAccount:terraform@${PROJECT_NAME}.iam.gserviceaccount.com:legacyBucketWriter gs://${BUCKET_NAME}
```

and have the backend.tf file created 
```hcl
terraform {
  required_version = ">= 0.12.24"
  
  backend "gcs" {
    bucket = "docker-js-stack-bucket"
    prefix = "terraform/state"
    credentials = "../../creds/google/terraform.json"
  }
}
```

### NOTE
> You will need state
https://github.com/KamilLelonek/k8s-gcp-terraform/blob/master/init.sh
https://blog.gruntwork.io/how-to-manage-terraform-state-28f5697e68fa

Also You cannot use any variables in the `terraform` object block.

## Continue terraform
This step I forgot to do earlier but are needed to set up kubernetes
```bash
gcloud config set compute/zone us-west1-b
```
Now that we have that simple setup run the init to get your `.terraform` directory built and state captured in the bucket
```bash
terraform init # optional --reconfigure if errors
```
Since I was having issues with deployment I turned on debug mode
```bash
$env:TF_LOG="DEBUG"
$env:TF_LOG_PATH="terraform_debug.txt"
```

Create the Plan file
```bash
terraform plan --out planfile
```
Apply the plan file to be executed
```bash
terraform apply planfile
```
Need to initialize the kubeconfig file with this command. I did notice after the cluster was created it outputed a couple of kubernetes items I think might be used to configure kubeconfig instead of having to run the command below but will have to look into how that is done.
* kube_access_token
* kube_ca_cert
* kube_endpoint
```bash
gcloud container clusters get-credentials cluster-1
```

Then follow the kubernetes steps for production release with kustomize and it works. 
This is still pretty manual but the concept is now proven. Took some 15 minutes to finish provisioning though.