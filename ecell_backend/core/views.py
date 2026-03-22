from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class PitchCreateView(APIView):
    def post(self, request):
        data = request.data
        return Response(
            {"message": "Pitch received successfully", "data": data},
            status=status.HTTP_201_CREATED
        )