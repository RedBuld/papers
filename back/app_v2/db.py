from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
# from sqlalchemy.ext.asyncio import AsyncAttrs
# from sqlalchemy.ext.asyncio import create_async_engine
# from sqlalchemy.ext.asyncio import async_sessionmaker

SQLALCHEMY_DATABASE_URL = "postgresql://papers.front:papers.front@localhost:5432/papers" # ?unix_socket=/var/run/mysqld/mysqld.sock&charset=utf8mb4
SQLALCHEMY_DATABASE_URL_CRON = "postgresql://papers.cron:papers.cron@localhost:5432/papers" # ?unix_socket=/var/run/mysqld/mysqld.sock&charset=utf8mb4

# engine_front = create_async_engine(
#     SQLALCHEMY_DATABASE_URL,
#     pool_size=10, max_overflow=0, pool_recycle=10, pool_pre_ping=True, pool_timeout=30, pool_reset_on_return='rollback'
# )
# SessionFront = async_sessionmaker(engine_front, expire_on_commit=False, autoflush=False, autocommit=False)

engine_front = create_engine(
    SQLALCHEMY_DATABASE_URL,
    pool_size=10, max_overflow=0, pool_recycle=10, pool_pre_ping=True, pool_timeout=30, pool_reset_on_return='rollback'
)
SessionFront = sessionmaker(engine_front, expire_on_commit=False, autoflush=False, autocommit=False)


engine_cron = create_engine(
    SQLALCHEMY_DATABASE_URL,
    pool_size=10, max_overflow=0, pool_recycle=10, pool_pre_ping=True, pool_timeout=30, pool_reset_on_return='rollback'
)
SessionCron = sessionmaker(engine_cron, expire_on_commit=False, autoflush=False, autocommit=False)

Base = declarative_base()
