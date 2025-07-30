from models import db, User, Ticket, Comment, TimeEntry, Client
from datetime import datetime, date
import uuid

def init_db(app):
    """Initialize the database with the Flask app"""
    print("Initializing database...")
    db.init_app(app)
    
    with app.app_context():
        print("Creating database tables...")
        db.create_all()
        print("Seeding database...")
        seed_database()
        print("Database initialization complete!")

def seed_database():
    """Seed the database with initial data"""
    # Check if data already exists
    if User.query.first() is not None:
        print("Database already seeded, skipping...")
        return
    
    print("Seeding database with initial data...")
    
    # Create admin user
    admin_user = User(
        id=str(uuid.uuid4()),
        name="Admin User",
        email="admin@peppermint.com",
        is_admin=True,
        role="admin",
        status="active",
        department="IT",
        phone="+1 (555) 123-4567"
    )
    admin_user.set_password("admin123")
    
    # Create demo user
    demo_user = User(
        id=str(uuid.uuid4()),
        name="Demo User",
        email="demo@example.com",
        is_admin=True,
        role="admin",
        status="active",
        department="Support",
        phone="+1 (555) 234-5678"
    )
    demo_user.set_password("demo123")
    
    # Create regular users
    user1 = User(
        id=str(uuid.uuid4()),
        name="John Doe",
        email="john.doe@company.com",
        is_admin=False,
        role="agent",
        status="active",
        department="Technical Support",
        phone="+1 (555) 345-6789"
    )
    user1.set_password("password123")
    
    user2 = User(
        id=str(uuid.uuid4()),
        name="Sarah Wilson",
        email="sarah.wilson@company.com",
        is_admin=False,
        role="agent",
        status="active",
        department="Customer Service",
        phone="+1 (555) 456-7890"
    )
    user2.set_password("password123")
    
    # Add users to database
    db.session.add(admin_user)
    db.session.add(demo_user)
    db.session.add(user1)
    db.session.add(user2)
    db.session.commit()
    
    # Create sample tickets
    ticket1 = Ticket(
        id=str(uuid.uuid4()),
        number=1001,
        title="Login Issue",
        detail="Users cannot log in with their credentials. The login page shows an error message after entering valid credentials.",
        status="needs_support",
        priority="high",
        type="bug",
        created_by=user1.id,
        assigned_to=user2.id
    )
    
    ticket2 = Ticket(
        id=str(uuid.uuid4()),
        number=1002,
        title="Feature Request: Dark Mode",
        detail="Add dark mode support to the application. This would improve user experience and reduce eye strain.",
        status="in_progress",
        priority="medium",
        type="feature",
        created_by=user2.id,
        assigned_to=user1.id
    )
    
    ticket3 = Ticket(
        id=str(uuid.uuid4()),
        number=1003,
        title="Website Performance Issues",
        detail="The homepage is taking too long to load and some images are broken. Users are reporting 404 errors.",
        status="resolved",
        priority="high",
        type="bug",
        is_complete=True,
        created_by=user1.id,
        assigned_to=user2.id
    )
    
    # Add tickets to database
    db.session.add(ticket1)
    db.session.add(ticket2)
    db.session.add(ticket3)
    db.session.commit()
    
    # Create sample comments
    comment1 = Comment(
        id=str(uuid.uuid4()),
        content="I've identified the issue with the database connection. Should be resolved by tomorrow.",
        is_internal=False,
        ticket_id=ticket1.id,
        user_id=user2.id
    )
    
    comment2 = Comment(
        id=str(uuid.uuid4()),
        content="The new dashboard design looks great! When can we expect it to go live?",
        is_internal=False,
        ticket_id=ticket2.id,
        user_id=user1.id
    )
    
    comment3 = Comment(
        id=str(uuid.uuid4()),
        content="This is an internal note: Need to check server logs for more details.",
        is_internal=True,
        ticket_id=ticket1.id,
        user_id=user2.id
    )
    
    # Add comments to database
    db.session.add(comment1)
    db.session.add(comment2)
    db.session.add(comment3)
    db.session.commit()
    
    # Create sample time entries
    time_entry1 = TimeEntry(
        id=str(uuid.uuid4()),
        description="Initial investigation of login issue",
        hours=2.5,
        date=date.today(),
        ticket_id=ticket1.id,
        user_id=user2.id
    )
    
    time_entry2 = TimeEntry(
        id=str(uuid.uuid4()),
        description="Dark mode UI design and implementation",
        hours=4.0,
        date=date.today(),
        ticket_id=ticket2.id,
        user_id=user1.id
    )
    
    # Add time entries to database
    db.session.add(time_entry1)
    db.session.add(time_entry2)
    db.session.commit()
    
    # Create sample clients
    client1 = Client(
        id=str(uuid.uuid4()),
        name="Acme Corporation",
        email="support@acme.com",
        contact_name="Jane Smith",
        phone="+1 (555) 123-4567",
        notes="Enterprise client with 500+ users"
    )
    
    client2 = Client(
        id=str(uuid.uuid4()),
        name="TechStart Inc",
        email="help@techstart.com",
        contact_name="Mike Johnson",
        phone="+1 (555) 234-5678",
        notes="Startup with growing user base"
    )
    
    # Add clients to database
    db.session.add(client1)
    db.session.add(client2)
    db.session.commit()
    
    print("Database seeded successfully!")

def get_next_ticket_number():
    """Get the next available ticket number"""
    last_ticket = Ticket.query.order_by(Ticket.number.desc()).first()
    if last_ticket:
        return last_ticket.number + 1
    return 1001 