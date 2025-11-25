from rest_framework import permissions

class IsAdminUserOrReadOnly(permissions.BasePermission):
    """
    Permissão personalizada que permite:
    - Leitura pública para todos (GET, HEAD, OPTIONS)
    - Ações de escrita apenas para usuários admin/staff
    """

    def has_permission(self, request, view):
        # Permitir todos os requests GET, HEAD ou OPTIONS
        if request.method in permissions.SAFE_METHODS:
            return True
            
        # Para ações de escrita, verificar se o usuário é staff ()
        return request.user and request.user.is_staff