let getSecretFileData = () => `apiVersion: v1
kind: Secret
metadata:
  name: graphql-secret
type: Opaque
data:`

export { getSecretFileData }
