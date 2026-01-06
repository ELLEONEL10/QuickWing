import asyncio
import logging

from sqlalchemy import select
from uuid6 import uuid7

from ..app.core.config import settings
from ..app.core.db.database import Base, AsyncSession, async_engine, local_session
from ..app.core.security import get_password_hash
from ..app.models.user import User
from ..app.models.tier import Tier
from ..app.models.rate_limit import RateLimit

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def create_tables() -> None:
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

async def create_first_user(session: AsyncSession) -> None:
    try:
        await create_tables()
        
        email = settings.ADMIN_EMAIL
        username = settings.ADMIN_USERNAME
        hashed_password = get_password_hash(settings.ADMIN_PASSWORD)

        query = select(User).filter_by(email=email)
        result = await session.execute(query)
        user = result.scalar_one_or_none()

        if user is None:
            new_user = User(
                name=settings.ADMIN_NAME,
                email=email,
                username=username,
                hashed_password=hashed_password,
                is_superuser=True,
                profile_image_url="https://profileimageurl.com",
                uuid=uuid7(), 
                is_deleted=False
            )
            session.add(new_user)
            await session.commit()
            logger.info(f"Admin user {username} created successfully.")
        else:
            logger.info(f"Admin user {username} already exists.")

    except Exception as e:
        logger.error(f"Error creating admin user: {e}")


async def main():
    async with local_session() as session:
        await create_first_user(session)


if __name__ == "__main__":
    asyncio.run(main())
