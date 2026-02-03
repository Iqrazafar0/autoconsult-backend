from django.db import models

class Service(models.Model):
    name = models.CharField(max_length=100)
    base_price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()

    def __str__(self):
        return self.name

class Project(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('active', 'Active'),
        ('completed', 'Completed'),
    ]
    title = models.CharField(max_length=200)
    client_name = models.CharField(max_length=100)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    image = models.ImageField(upload_to='project_images/', null=True, blank=True)
    deadline = models.DateField(null=True, blank=True) # Isay null=True kiya taake error na aaye

    def __str__(self):
        return f"{self.title} - {self.status}"

class ClientRequest(models.Model):
    client_name = models.CharField(max_length=200)
    email = models.EmailField()
    service_interested = models.CharField(max_length=200)
    message = models.TextField()
    # CLIENT KE LIYE IMAGE FIELD YAHAN ADD KI HAI:
    image = models.ImageField(upload_to='client_requests/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Request from {self.client_name}"