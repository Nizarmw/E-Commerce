FROM golang:alpine3.21 AS builder

WORKDIR /app

# Set Go proxy for better connectivity
ENV GOPROXY=https://proxy.golang.org,direct
ENV GOSUMDB=sum.golang.org

COPY go.mod go.sum ./

# Download dependencies with retry logic
RUN for i in 1 2 3; do \
    go mod download && break || \
    (echo "Retry $i: Failed to download Go modules, retrying in 10s..." && sleep 10); \
    done

COPY . ./

RUN mkdir build
RUN CGO_ENABLED=0 GOOS=linux go build -o ./server ./main.go

FROM alpine:latest

# Use multiple Alpine mirrors for better reliability
RUN echo "http://dl-cdn.alpinelinux.org/alpine/latest-stable/main" > /etc/apk/repositories && \
    echo "http://dl-cdn.alpinelinux.org/alpine/latest-stable/community" >> /etc/apk/repositories && \
    echo "http://mirrors.edge.kernel.org/alpine/latest-stable/main" >> /etc/apk/repositories && \
    echo "http://mirrors.edge.kernel.org/alpine/latest-stable/community" >> /etc/apk/repositories

# Install ca-certificates with retry logic
RUN for i in 1 2 3; do \
    apk update && apk add --no-cache ca-certificates && update-ca-certificates && break || \
    (echo "Retry $i: Failed to install packages, retrying in 10s..." && sleep 10); \
    done

COPY --from=builder /app/server /app/server

EXPOSE 8080

CMD ["/app/server"]