FROM golang:1.21-alpine AS builder

WORKDIR /app

# Copy go mod files first for better caching
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . ./

# Build the application
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o main ./main.go

FROM alpine:latest

# Install ca-certificates for HTTPS requests
RUN apk update && apk add --no-cache ca-certificates && update-ca-certificates

# Create non-root user for security
RUN adduser -D -s /bin/sh appuser

WORKDIR /app

# Copy binary from builder stage
COPY --from=builder /app/main .

# Copy environment file if needed
COPY .env .env

# Change ownership to non-root user
RUN chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

# Run the binary
CMD ["./main"]