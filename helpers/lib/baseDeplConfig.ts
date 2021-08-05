const getBaseDeplConfig = () => `apiVersion: apps/v1
kind: Deployment
metadata:
  name: graphql
  labels:
    app: graphql
spec:
  replicas: 2
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: graphql
  template:
    metadata:
      labels:
        app: graphql
    spec:
      containers:
        - name: graphql
          image: yassineldeeb/graphql:1
          imagePullPolicy: Always
          ports:
            - containerPort: 4000
          volumeMounts:
            - name: profile-images
              mountPath: /uploads/profile_images

            - name: posts-images
              mountPath: /uploads/posts_images

            - name: postgres-backups
              mountPath: /backups
          resources:
            requests:
              memory: '300Mi'
              cpu: '250m'
            limits:
              memory: '1000Mi'
              cpu: '2000m'
          env:
            - name: PG_USER
              valueFrom:
                secretKeyRef:
                  name: postgres-secret
                  key: pg-username
            - name: PG_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: postgres-secret
                  key: pg-password
            - name: DB_NAME
              value: prisma-pg
            - name: DB_URL
              valueFrom:
                configMapKeyRef:
                  name: postgres-configmap
                  key: database_url
            - name: DATABASE_URL
              value: 'postgresql://$(PG_USER):$(PG_PASSWORD)@$(DB_URL)/prisma-pg?schema=public'
            - name: REDIS_HOST
              valueFrom:
                configMapKeyRef:
                  name: redis-configmap
                  key: redis_host$((((INJECT_SECRETS))))
      volumes:
        - name: profile-images
          persistentVolumeClaim:
            claimName: 'profile-images-pv-claim'

        - name: posts-images
          persistentVolumeClaim:
            claimName: 'posts-images-pv-claim'

        - name: postgres-backups
          persistentVolumeClaim:
            claimName: pg-backups-pv-claim

`
export { getBaseDeplConfig }
