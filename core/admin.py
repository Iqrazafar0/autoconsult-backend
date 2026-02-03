from django.contrib import admin
from .models import Service, Project, ClientRequest

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('name', 'base_price')

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    # Bahar table mein ye dikhega
    list_display = ('title', 'client_name', 'status', 'deadline', 'image')
    # Click karne ke baad andar ye fields aur upload button dikhega
    fields = ('title', 'client_name', 'status', 'deadline', 'image')
    list_filter = ('status',)

@admin.register(ClientRequest)
class ClientRequestAdmin(admin.ModelAdmin):
    # Client ki request mein image field
    list_display = ('client_name', 'email', 'service_interested', 'image')
    fields = ('client_name', 'email', 'service_interested', 'message', 'image')