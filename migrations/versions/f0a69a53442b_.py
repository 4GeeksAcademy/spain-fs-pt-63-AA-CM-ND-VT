"""empty message

Revision ID: f0a69a53442b
Revises: 
Create Date: 2024-06-27 18:35:21.975725

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f0a69a53442b'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('master_services',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('type', sa.String(length=50), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('users',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('name', sa.String(length=50), nullable=False),
    sa.Column('email', sa.String(length=50), nullable=False),
    sa.Column('password', sa.String(length=128), nullable=False),
    sa.Column('rol', sa.String(length=50), nullable=False),
    sa.Column('image', sa.String(length=75), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email')
    )
    op.create_table('companies',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('name', sa.String(length=50), nullable=False),
    sa.Column('location', sa.String(length=50), nullable=False),
    sa.Column('owner', sa.Integer(), nullable=False),
    sa.Column('image', sa.String(length=75), nullable=True),
    sa.ForeignKeyConstraint(['owner'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('services',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('name', sa.String(length=50), nullable=False),
    sa.Column('description', sa.String(length=50), nullable=False),
    sa.Column('type', sa.Integer(), nullable=False),
    sa.Column('price', sa.Integer(), nullable=False),
    sa.Column('duration', sa.Integer(), nullable=False),
    sa.Column('companies_id', sa.Integer(), nullable=False),
    sa.Column('available', sa.Boolean(), nullable=False),
    sa.Column('image', sa.String(length=75), nullable=True),
    sa.ForeignKeyConstraint(['companies_id'], ['companies.id'], ),
    sa.ForeignKeyConstraint(['type'], ['master_services.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('bookings',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('services_id', sa.Integer(), nullable=False),
    sa.Column('users_id', sa.Integer(), nullable=False),
    sa.Column('start_day_date', sa.String(length=50), nullable=False),
    sa.Column('start_time_date', sa.String(length=50), nullable=False),
    sa.ForeignKeyConstraint(['services_id'], ['services.id'], ),
    sa.ForeignKeyConstraint(['users_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('ratings',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('comment', sa.String(length=50), nullable=False),
    sa.Column('stars', sa.Integer(), nullable=False),
    sa.Column('users_id', sa.Integer(), nullable=False),
    sa.Column('services_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['services_id'], ['services.id'], ),
    sa.ForeignKeyConstraint(['users_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('requests',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('bookings_id', sa.Integer(), nullable=False),
    sa.Column('status', sa.String(length=20), nullable=False),
    sa.Column('comment', sa.String(length=120), nullable=True),
    sa.ForeignKeyConstraint(['bookings_id'], ['bookings.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('requests')
    op.drop_table('ratings')
    op.drop_table('bookings')
    op.drop_table('services')
    op.drop_table('companies')
    op.drop_table('users')
    op.drop_table('master_services')
    # ### end Alembic commands ###