
# Deployment

## Install Azure CLI and kubectl
After setting up your AKS Cluster on Azure, [install the Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest). The Azure CLI is a command-line tool for managing Azure resources. 

Next, connect to the Kubernetes cluster from your local computer with [kubectl](https://kubernetes.io/docs/reference/kubectl/kubectl/), the Kubernetes command-line client. If you're using the Azure Cloud Shell, `kubectl` is already installed. To install it locally, use the [az aks install-cli](https://docs.microsoft.com/cli/azure/aks#az-aks-install-cli) command:
```
az aks install-cli
```

## Connect to cluster using kubectl
Configure `kubectl` to connect to your AKS cluster with the [az aks get-credentials](https://docs.microsoft.com/cli/azure/aks#az-aks-get-credentials) command:
```
az aks get-credentials --resource-group myResourceGroup --name myAKSCluster
```

Verify your connection with the [kubectl get nodes](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get) command:
```
$ kubectl get nodes

NAME                       STATUS   ROLES   AGE     VERSION
aks-nodepool1-28993262-0   Ready    agent   3m18s   v1.9.11
```

## Deploy APIs
Pull the deep-art code repository and `cd` into the API folder that you want to deploy. For example:
```
cd APIs/BigGAN
```

To deploy the APIs, use the [kubectl apply](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply) command. This command parses the manifest (YAML) file and creates the defined Kubernetes objects. Specify the manifest files and apply it to the cluster. For example:
```
kubectl apply -f BigGAN.yaml
```

## Check AKS Cluster Status
Open your Kubernetes cluster UI with [kubectl proxy](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#proxy):
```
kubectl proxy
```
Connect to the displayed IP in any web browser. You should see the API running in the deployments, pods, and services. If that doesn't work, try using this IP:
```
http://localhost:8001/api/v1/namespaces/kube-system/services/kubernetes-dashboard/proxy/
```