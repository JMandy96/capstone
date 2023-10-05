from app import create_app
from app.blueprints.main.product import fetch_and_populate

app = create_app()

@app.cli.command("fetchdata")
def fetchdata_command():
    """Fetch and populate the database with data from the external API."""
    fetch_and_populate()