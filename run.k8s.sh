#!/bin/bash
# Apply Graphql Ingress
kubectl apply -f ./kubernetes/graphql-ingress.yml
# Apply Metrics
kubectl apply -f ./kubernetes/metrics.yml
# Apply Configmaps
kubectl apply -f ./kubernetes/configmaps/pg-configmap.yml
kubectl apply -f ./kubernetes/configmaps/redis-configmap.yml
# Apply Deployments
kubectl apply -f ./kubernetes/deployments/graphql-depl.yml
kubectl apply -f ./kubernetes/deployments/pg-backup.yml
kubectl apply -f ./kubernetes/deployments/pg-depl.yml
kubectl apply -f ./kubernetes/deployments/redis-depl.yml
# Apply Jobs
kubectl apply -f ./kubernetes/jobs/restore-job.yml
# Apply Secrets
kubectl apply -f ./kubernetes/secrets/aws-secret.yml
kubectl apply -f ./kubernetes/secrets/graphql-secret.yml
kubectl apply -f ./kubernetes/secrets/pg-secret.yml
kubectl apply -f ./kubernetes/secrets/pgpass-secret.yml
# Scale GraphQL Server horizontally
kubectl scale deployment graphql --replicas=0
kubectl scale deployment graphql --replicas=2