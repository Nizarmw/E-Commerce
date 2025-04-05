FROM golang:alpine3.21 AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . ./

RUN mkdir build
RUN CGO_ENABLED=0 GOOS=linux go build -o ./server ./main.go

FROM alpine:latest
RUN apk update && apk add --no-cache ca-certificates && update-ca-certificates

COPY --from=builder /app/server /app/server
COPY .env .env

CMD ["/app/server"]