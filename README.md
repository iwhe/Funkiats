<h1>Funkiats</h1>

<p>Funkiats is a web application that uses machine learning to analyze the user's emotions and provide personalized music recommendations.</p>

<p> Funkiats is an emotion-based music recommendation system that utilizes facial expression analysis to suggest music aligned with the detected emotional state. </p>

<p> The system captures facial features through a camera, processes them using a machine learning model trained on the FER-2013 dataset, and classifies the underlying emotion. </p>

<p> Based on the identified emotion, Funkiats integrates with the Spotify API to recommend suitable songs, playlists, and music selections. This approach combines computer vision, machine learning, and music personalization to create an intelligent and adaptive recommendation framework. </p>

<h2> Tech Stack </h2>

<p> <strong>Frontend:</strong> React, Tailwind CSS, Vite </p>
<p> <strong>Backend:</strong> Node.js, Express </p>
<p> <strong>Machine Learning:</strong> Python, OpenCV, Keras </p>
<p> <strong>Authentication:</strong> Spotify API </p>
<p> <strong>Deployment:</strong> Vercel, Railway </p>

<h2> Setup </h2>

<h3> Clone the repository </h3>

```bash
git clone https://github.com/iwhe/funkiats.git
```

<h3> Install dependencies </h3>

<h4> For frontend </h4>

```bash
npm install
```

<h4> For backend </h4>

```bash
cd backend
npm install
```

<h4> For emotion detection microservice </h4>

```bash
cd backend/emotion_detection
pip install -r requirements.txt
```

<h3> Run the application </h3>

<h4> For frontend </h4>

```bash
npm run dev
```

<h4> For backend </h4>

```bash
npm start
```

<h4> For emotion detection microservice </h4>

```bash
python emotion_detection.py
```


<i>Enjoy funkiats</i>