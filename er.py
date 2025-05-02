# broadcast.py
import asyncio

class Broadcaster:
    def __init__(self):
        self.connections = []

    async def connect(self):
        queue = asyncio.Queue()
        self.connections.append(queue)
        return queue

    async def disconnect(self, queue):
        self.connections.remove(queue)

    async def send(self, message: str):
        print("➡️ Envoi SSE:", message)
        for queue in self.connections:
            await queue.put(message)
