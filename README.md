<h1>AutoConsult - Business Strategy Portal</h1>

<p>A professional full-stack web application designed for a consulting firm to manage client requests, showcase services, and track ongoing projects.</p>

<h2>Features</h2>
<ul>
  <li><strong>Client Inquiry System:</strong>Users can submit strategy requests via a custom-built form.</li>
  <li><strong>Dynamic Service Catalog:</strong>Services are fetched dynamically from a PostgreSQL database.</li>
  <li><strong>Project Portfolio:</strong>Displays completed projects with categories and images.</li>
  <li><strong>Admin Dashboard:</strong>A secure area for the consulting team to manage leads and update site content.</li>
  <li><strong>Responsive Design:</strong>Fully optimized for mobile, tablet, and desktop views.</li>
</ul>

<h2>Tech Stack</h2>
<ul>
  <li><strong>Frontend:</strong>React.js, Tailwind CSS, Framer Motion (for animations).</li>
  <li><strong>Backend:</strong>Django REST Framework (DRF).</li>
  <li><strong>Database:</strong>PostgreSQL (Hosted on Neon).</li>
  <li><strong>Deployment:</strong>Render (Frontend & Backend).</li>
</ul>

<h2>Project Structure</h2>
<ul>
  <li>`/core`: Contains Django models, views, and serializers.</li>
  <li>`/media`: Storage for service and project images.</li>
  <li>`/backend`: Project configuration and settings.</li>
</ul>

<h2>Setup & Installation</h2>
<ol>
  <li>Clone the repository.</li>
  <li>Install dependencies: `pip install -r requirements.txt`.</li>
  <li>Set up environment variables for Database and Secret Key.</li>
  <li>Run migrations: `python manage.py migrate`.</li>
  <li>Start the server: `python manage.py runserver`.</li>
</ol>

<p>
  <strong>Developed with ❤️ by Iqra Zafar</strong>
</p>
