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
Now that we have that simple setup run the init to get your `.terraform` directory built and state captured in the bucket
```bash
terraform init # optional --reconfigure if errors
```

