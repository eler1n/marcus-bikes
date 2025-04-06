"""
Migration script to update the database schema for admin panel functionality.
This script adds and modifies tables needed for the e-commerce admin features.
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# Import enums for type checking
from app.models.enums import OrderStatusEnum, StockStatusEnum, CategoryEnum, DependencyTypeEnum

# revision identifiers, used by Alembic
revision = 'admin_panel_support'
down_revision = None  # Set to the previous migration or None if this is the first
branch_labels = None
depends_on = None

def upgrade():
    # Update options table to ensure stock tracking
    op.add_column('options', sa.Column('stock_quantity', sa.Integer(), nullable=False, server_default='0'))

    # Create inventory table if it doesn't exist
    if not op.get_bind().dialect.has_table(op.get_bind(), 'inventory'):
        op.create_table('inventory',
            sa.Column('id', sa.Integer(), nullable=False),
            sa.Column('option_id', sa.Integer(), nullable=False),
            sa.Column('quantity', sa.Integer(), nullable=False, server_default='0'),
            sa.Column('stock_status', sa.Enum(StockStatusEnum), nullable=False, server_default='OUT_OF_STOCK'),
            sa.Column('low_stock_threshold', sa.Integer(), nullable=False, server_default='5'),
            sa.ForeignKeyConstraint(['option_id'], ['options.id'], ),
            sa.PrimaryKeyConstraint('id')
        )
    
    # Add last_updated field to inventory for tracking changes
    if not sa.Column('last_updated') in op.get_bind().execute('SELECT * FROM inventory LIMIT 0').keys():
        op.add_column('inventory', sa.Column('last_updated', sa.DateTime(), 
                                            server_default=sa.text('CURRENT_TIMESTAMP'),
                                            nullable=False))
    
    # Ensure orders table has all required fields
    # Check if orders table exists
    if not op.get_bind().dialect.has_table(op.get_bind(), 'orders'):
        op.create_table('orders',
            sa.Column('id', sa.Integer(), nullable=False),
            sa.Column('customer_name', sa.String(), nullable=False),
            sa.Column('customer_email', sa.String(), nullable=False),
            sa.Column('shipping_address', sa.String(), nullable=False),
            sa.Column('total_amount', sa.Float(), nullable=False),
            sa.Column('created_at', sa.DateTime(), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=False),
            sa.Column('updated_at', sa.DateTime(), server_default=sa.text('CURRENT_TIMESTAMP'), 
                      onupdate=sa.text('CURRENT_TIMESTAMP'), nullable=False),
            sa.Column('status', sa.Enum(OrderStatusEnum), nullable=False, server_default='PENDING'),
            sa.Column('order_details', postgresql.JSON(astext_type=sa.Text()), nullable=False),
            sa.Column('product_categories', sa.String(), nullable=True),
            sa.PrimaryKeyConstraint('id')
        )
    else:
        # Ensure order_details column exists and is JSON type
        if 'order_details' not in op.get_bind().execute('SELECT * FROM orders LIMIT 0').keys():
            op.add_column('orders', sa.Column('order_details', postgresql.JSON(astext_type=sa.Text()), 
                                             nullable=False, server_default='{}'))
        
        # Ensure product_categories column exists for filtering
        if 'product_categories' not in op.get_bind().execute('SELECT * FROM orders LIMIT 0').keys():
            op.add_column('orders', sa.Column('product_categories', sa.String(), nullable=True))
    
    # Create indices for better query performance
    op.create_index(op.f('ix_orders_status'), 'orders', ['status'], unique=False)
    op.create_index(op.f('ix_orders_created_at'), 'orders', ['created_at'], unique=False)
    op.create_index(op.f('ix_inventory_stock_status'), 'inventory', ['stock_status'], unique=False)

def downgrade():
    # Remove indices
    op.drop_index(op.f('ix_inventory_stock_status'), table_name='inventory')
    op.drop_index(op.f('ix_orders_created_at'), table_name='orders')
    op.drop_index(op.f('ix_orders_status'), table_name='orders')
    
    # Remove columns (but keep tables to avoid data loss)
    if 'product_categories' in op.get_bind().execute('SELECT * FROM orders LIMIT 0').keys():
        op.drop_column('orders', 'product_categories')
    
    if 'last_updated' in op.get_bind().execute('SELECT * FROM inventory LIMIT 0').keys():
        op.drop_column('inventory', 'last_updated')
    
    # Don't drop the stock_quantity from options as it may cause data issues 