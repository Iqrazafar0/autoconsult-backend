from rest_framework import viewsets
from django.core.mail import send_mail
from django.conf import settings
from .models import Service, Project, ClientRequest
from .serializers import ServiceSerializer, ProjectSerializer, ClientRequestSerializer

class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

class ClientRequestView(viewsets.ModelViewSet):
    queryset = ClientRequest.objects.all()
    serializer_class = ClientRequestSerializer

    # Jab naya request save hoga, tab ye function chale ga
    def perform_create(self, serializer):
        # 1. Pehle data database mein save karein
        instance = serializer.save()

        # 2. Email ki details tayyar karein
        subject = 'Welcome to AutoConsult - Request Received'
        message = f"""
Dear {instance.client_name},

Thank you for reaching out to AutoConsult! 

We have received your interest in our service: "{instance.service_interested}". 
Our expert strategy team is reviewing your details and will contact you within the next 24 hours.

Your Message:
"{instance.message}"

Best Regards,
The AutoConsult Team
        """
        recipient_list = [instance.email]

        # 3. Email send karein
        try:
            send_mail(
                subject, 
                message, 
                settings.EMAIL_HOST_USER, 
                recipient_list, 
                fail_silently=False
            )
        except Exception as e:
            print(f"Email sending failed: {e}")