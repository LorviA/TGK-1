"""fix_directory_data

Revision ID: c074e9b933b3
Revises: 4fe210f4dbf6
Create Date: 2025-04-08 19:32:02.526469

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c074e9b933b3'
down_revision: Union[str, None] = '4fe210f4dbf6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.execute("""
        UPDATE directories 
        SET directory_type = 'StSmet' 
        WHERE LOWER(directory_type) IN ('stsmet', 'stsmet')
    """)
    op.execute("""
        UPDATE directories
        SET st = NULL, description = NULL, is_group = NULL
        WHERE directory_type = 'ConfidentialityOfInformation'
    """)


def downgrade() -> None:
    """Downgrade schema."""
    pass
