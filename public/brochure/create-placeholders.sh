#!/bin/bash
# Create 1x1 pixel placeholder images

# Base64 encoded 1x1 copper-colored JPEG
PLACEHOLDER_BASE64="/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA/9k="

# Create placeholder images
for img in hero-luxury-room.jpg hotel-staff-management.jpg kitchen-operations.jpg room-service-cart.jpg; do
    echo "$PLACEHOLDER_BASE64" | base64 -d > "$img"
    echo "Created placeholder: $img"
done

echo ""
echo "Placeholder images created!"
echo "Replace these with your actual images from the chat upload."
