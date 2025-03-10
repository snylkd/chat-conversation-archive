from fastapi import FastAPI, Form, UploadFile, File, HTTPException
from io import BytesIO
import shutil
from pydantic import BaseModel, constr
from typing import Optional

app = FastAPI()

class ChatMessage(BaseModel):
    message: constr(max_length=500)  # Limite de longueur du message
    file: Optional[UploadFile] = File(None, media_type=["image/png", "image/jpeg"])  # Optionnel
    cid: Optional[str]  # Optionnel

    class Config:
        extra = "forbid"  # Ne permet pas de champs supplémentaires

@app.post("/chat")
async def chat_endpoint(request: ChatMessage):
    message = request.message
    cid = request.cid
    file = request.file

    if not message.strip():
        raise HTTPException(status_code=422, detail="Le message est requis et ne doit pas être vide.")

    # Traitement du fichier si présent
    if file:
        bytes_io = BytesIO()
        await file.seek(0)
        shutil.copyfileobj(file.file, bytes_io)
        bytes_io.seek(0)
        
        file_name = file.filename
        content_type = file.content_type
        bytes_io.close()

        return {"message": message, "file_name": file_name, "content_type": content_type, "cid": cid or "no cid provided"}

    # Si pas de fichier, simplement répondre avec le message
    return {"message": message, "cid": cid or "no cid provided"}
