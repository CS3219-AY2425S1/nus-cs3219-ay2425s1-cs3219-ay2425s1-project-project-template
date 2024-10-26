ns_exist=$(kubectl get ns | grep peerprep)
if [[ -z $ns_exist ]]; then 
  echo "Does not exist"
else
  echo "Exist"
fi

