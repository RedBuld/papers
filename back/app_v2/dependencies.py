import math
import random
from app_v2.db import SessionFront

async def get_session():
    session = SessionFront
    yield session

def update_db():
    from app_v2.db import engine_front, Base
    Base.metadata.create_all( bind=engine_front, checkfirst=True )


def generateOTP():
    digits = "0123456789"
    OTP = ""

    for i in range(6):
        OTP += digits[math.floor(random.random() * 10)]
 
    return OTP