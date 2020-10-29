from rest_framework import serializers

class SuggestionSerializer(serializers.Serializer):
    term = serializers.CharField(min_length=1)