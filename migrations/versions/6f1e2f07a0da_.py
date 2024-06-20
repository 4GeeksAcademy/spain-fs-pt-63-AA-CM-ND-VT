"""empty message

Revision ID: 6f1e2f07a0da
Revises: f58b249ea065
Create Date: 2024-06-13 18:12:40.205719

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '6f1e2f07a0da'
down_revision = 'f58b249ea065'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('bookings', schema=None) as batch_op:
        batch_op.add_column(sa.Column('start_time_date', sa.DateTime(), nullable=False))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('bookings', schema=None) as batch_op:
        batch_op.drop_column('start_time_date')

    # ### end Alembic commands ###
