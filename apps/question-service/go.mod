module question-service

require proto v0.0.0

replace proto => ../proto

go 1.23.1

require (
	cloud.google.com/go/firestore v1.17.0
	firebase.google.com/go/v4 v4.14.1
	github.com/go-chi/chi/v5 v5.1.0
	google.golang.org/api v0.198.0
	google.golang.org/grpc v1.67.1
)

require github.com/joho/godotenv v1.5.1

require (
	cloud.google.com/go v0.115.1 // indirect
	cloud.google.com/go/auth v0.9.4 // indirect
	cloud.google.com/go/auth/oauth2adapt v0.2.4 // indirect
	cloud.google.com/go/compute/metadata v0.5.1 // indirect
	cloud.google.com/go/iam v1.2.1 // indirect
	cloud.google.com/go/longrunning v0.6.1 // indirect
	cloud.google.com/go/storage v1.43.0 // indirect
	github.com/MicahParks/keyfunc v1.9.0 // indirect
	github.com/felixge/httpsnoop v1.0.4 // indirect
	github.com/go-chi/cors v1.2.1
	github.com/go-logr/logr v1.4.2 // indirect
	github.com/go-logr/stdr v1.2.2 // indirect
	github.com/golang-jwt/jwt/v4 v4.5.0
	github.com/golang/groupcache v0.0.0-20210331224755-41bb18bfe9da // indirect
	github.com/golang/protobuf v1.5.4 // indirect
	github.com/google/s2a-go v0.1.8 // indirect
	github.com/google/uuid v1.6.0 // indirect
	github.com/googleapis/enterprise-certificate-proxy v0.3.4 // indirect
	github.com/googleapis/gax-go/v2 v2.13.0 // indirect
	go.opencensus.io v0.24.0 // indirect
	go.opentelemetry.io/contrib/instrumentation/google.golang.org/grpc/otelgrpc v0.55.0 // indirect
	go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp v0.55.0 // indirect
	go.opentelemetry.io/otel v1.30.0 // indirect
	go.opentelemetry.io/otel/metric v1.30.0 // indirect
	go.opentelemetry.io/otel/trace v1.30.0 // indirect
	golang.org/x/crypto v0.27.0 // indirect
	golang.org/x/net v0.29.0 // indirect
	golang.org/x/oauth2 v0.23.0 // indirect
	golang.org/x/sync v0.8.0 // indirect
	golang.org/x/sys v0.25.0 // indirect
	golang.org/x/text v0.18.0 // indirect
	golang.org/x/time v0.6.0 // indirect
	google.golang.org/appengine/v2 v2.0.6 // indirect
	google.golang.org/genproto v0.0.0-20240903143218-8af14fe29dc1 // indirect
	google.golang.org/genproto/googleapis/api v0.0.0-20240903143218-8af14fe29dc1 // indirect
	google.golang.org/genproto/googleapis/rpc v0.0.0-20240903143218-8af14fe29dc1 // indirect
	google.golang.org/protobuf v1.35.1 // indirect
)
