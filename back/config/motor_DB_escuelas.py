from motor.motor_asyncio import AsyncIOMotorClient
cliente = AsyncIOMotorClient('mongodb+srv://paulo:Paulo2023@cluster0.prraayx.mongodb.net/escuelas?retryWrites=true&w=majority')
database = cliente.escuelas
