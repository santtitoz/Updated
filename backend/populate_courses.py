import os
import django
from django.utils.text import slugify

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from trilhas.models import Trilha, Modulo, Atividade
from user.models import CustomUser

def populate():
    print("Iniciando população do banco de dados...")

    # 1. Obter ou criar um autor
    try:
        author = CustomUser.objects.first()
        if not author:
            print("Nenhum usuário encontrado. Crie um usuário primeiro.")
            return
        print(f"Autor definido: {author.email}")
    except Exception as e:
        print(f"Erro ao buscar autor: {e}")
        return

    # 2. Criar Trilha
    trilha_title = "Full Stack Python com Django"
    trilha_slug = slugify(trilha_title)
    
    # Verifica se já existe para não duplicar
    if Trilha.objects.filter(slug=trilha_slug).exists():
        print(f"Trilha '{trilha_title}' já existe.")
        trilha = Trilha.objects.get(slug=trilha_slug)
    else:
        trilha = Trilha.objects.create(
            title=trilha_title,
            slug=trilha_slug,
            description="Domine o desenvolvimento web moderno com Python, Django e React. Aprenda desde os fundamentos até o deploy.",
            category="Back-end",
            author=author,
            duration="40h 30m"
        )
        print(f"Trilha criada: {trilha.title}")

    # 3. Criar Módulos e Atividades
    modules_data = [
        {
            "title": "Fundamentos do Python",
            "description": "Aprenda a sintaxe básica, estruturas de dados e orientação a objetos.",
            "order": 1,
            "activities": [
                {"title": "Instalando o Python e VSCode", "type": "video", "order": 1, "xp": 10, "desc": "Configurando o ambiente."},
                {"title": "Variáveis e Tipos de Dados", "type": "text", "order": 2, "xp": 15, "desc": "Entendendo strings, ints e floats."},
                {"title": "Estruturas de Controle", "type": "text", "order": 3, "xp": 20, "desc": "If, else, for e while."},
                {"title": "Quiz: Lógica de Programação", "type": "quiz", "order": 4, "xp": 50, "desc": "Teste seus conhecimentos."}
            ]
        },
        {
            "title": "Introdução ao Django",
            "description": "Crie suas primeiras aplicações web com o framework mais popular do Python.",
            "order": 2,
            "activities": [
                {"title": "O que é Django?", "type": "video", "order": 1, "xp": 10, "desc": "Visão geral do framework."},
                {"title": "Criando o primeiro projeto", "type": "text", "order": 2, "xp": 20, "desc": "django-admin startproject."},
                {"title": "Models e Migrations", "type": "text", "order": 3, "xp": 30, "desc": "Trabalhando com banco de dados."},
                {"title": "Views e Templates", "type": "video", "order": 4, "xp": 25, "desc": "Renderizando HTML."}
            ]
        },
        {
            "title": "API Rest com Django Rest Framework",
            "description": "Construa APIs robustas e escaláveis.",
            "order": 3,
            "activities": [
                {"title": "Serializers", "type": "text", "order": 1, "xp": 30, "desc": "Convertendo objetos em JSON."},
                {"title": "ViewSets e Routers", "type": "text", "order": 2, "xp": 30, "desc": "Automatizando rotas CRUD."},
                {"title": "Autenticação JWT", "type": "video", "order": 3, "xp": 40, "desc": "Protegendo sua API."}
            ]
        }
    ]

    for mod_data in modules_data:
        modulo, created = Modulo.objects.get_or_create(
            trilha=trilha,
            title=mod_data["title"],
            defaults={
                "description": mod_data["description"],
                "order": mod_data["order"]
            }
        )
        if created:
            print(f"  Módulo criado: {modulo.title}")
        else:
            print(f"  Módulo já existe: {modulo.title}")

        for act_data in mod_data["activities"]:
            atividade, act_created = Atividade.objects.get_or_create(
                module=modulo,
                title=act_data["title"],
                defaults={
                    "type": act_data["type"],
                    "description": act_data["desc"],
                    "content": f"Conteúdo demonstrativo para a atividade '{act_data['title']}'.",
                    "order": act_data["order"],
                    "xp_reward": act_data["xp"]
                }
            )
            if act_created:
                print(f"    Atividade criada: {atividade.title}")

    print("População concluída com sucesso!")

if __name__ == "__main__":
    populate()
