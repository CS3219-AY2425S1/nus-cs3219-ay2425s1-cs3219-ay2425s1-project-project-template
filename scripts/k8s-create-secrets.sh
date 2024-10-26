#!/bin/sh
ns=peerprep
pkgs=("backend/user" "backend/question" "backend/collaboration" "backend/matching" "frontend")

create_secret() {
  local secretName=$1
  envFolder=""
  re='backend/(.+)'
  if [[ $secretName =~ $re ]]; then 
    secretName="${BASH_REMATCH[1]}"
    envFolder="backend/"
  else 
    envFolder=""
  fi
  sed -E 's/="(.+)"/=\1/g' "$envFolder$secretName/.env.compose" | \
  kubectl -n $ns \
    create secret generic \
    "$secretName-secret" \
    --from-env-file /dev/stdin
}

for pkg in "${pkgs[@]}"; do
  create_secret $pkg
done
