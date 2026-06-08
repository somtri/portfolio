import type { ResumeSection } from "@/types/resume";

export const resumeSections: ResumeSection[] = [
  {
    title: "Education",
    items: [
      {
        heading: "Iowa State University",
        meta: "Ames, IA / Expected Graduation: May 2028",
        details: [
          "Bachelor of Science in Software Engineering",
          "Minors in Artificial Intelligence and Data Science",
        ],
      },
    ],
  },
  {
    title: "Experience",
    items: [
      {
        heading:
          "Computer Vision Research Intern / AI Institute for Resilient Agriculture (AIIRA)",
        meta: "Jun 2026 - Present / Ames, IA",
        details: [
          "Building computer vision pipelines for agricultural phenotyping, converting drone- and phone-recorded RGB tassel videos from field data collection into 3D point clouds for maize analysis.",
          "Supporting Structure-from-Motion and NeRF-based reconstruction workflows using COLMAP, Nerfstudio, OpenCV, Open3D, CloudCompare, CUDA, and Jetstream2.",
          "Developing data-processing pipelines for raw video, frame extraction, camera pose estimation, NeRF training, point-cloud export, and individual tassel .ply extraction.",
        ],
      },
      {
        heading:
          "Machine Learning Research Intern / Translational AI Center (TrAC)",
        meta: "Aug 2025 - Present / Ames, IA",
        details: [
          "Expanded a D-ICL benchmark for tabular foundation models by adding 5 public regression datasets, large synthetic regression tasks, and OpenML Yolanda dataset 42705 to the evaluation pipeline.",
          "Ran TabPFN and TabICL experiments across IID/non-IID partitions, 120k-sample large-regression settings, and paper-aligned seeds, reporting RMSE, MAE, R2, and mean/standard-deviation summaries.",
          "Implemented batched regression inference to resolve CUDA memory limits on large test sets and generated reproducible JSON/CSV summaries supporting a paper currently under review at NeurIPS.",
        ],
      },
      {
        heading: "Undergraduate Research Assistant / Iowa State University",
        meta: "Jan 2025 - Jul 2025 / Ames, IA",
        details: [
          "Improved LPBF spatter-tracking accuracy by approximately 20% over manual methods by building a Python computer-vision pipeline with NumPy, Pandas, SciPy, OpenCV, and scikit-learn.",
          "Applied feature extraction and statistical modeling to analyze spatter velocity, size, and ejection angle across LPBF high-speed imaging experiments.",
          "Visualized 30,000 fps high-speed imaging data with Matplotlib, supporting reproducible large-scale ML experiments.",
        ],
      },
    ],
  },
  {
    title: "Projects",
    items: [
      {
        heading: "RunScope - LPBF Process Monitoring Dashboard",
        meta: "Rust / React / TypeScript / WebSockets / SQLite / Jun 2026",
        details: [
          "Built a research-inspired Rust and React MVP for LPBF process monitoring with real-time telemetry, recipe sequencing, rule-based anomaly detection, SQLite-backed run history, and process simulations for oxygen, temperature, recoater, laser, and spatter behavior.",
          "Developed an async Rust/Axum/Tokio backend with REST APIs, SQLx, and 300 ms WebSocket updates, plus a React/TypeScript dashboard with live charts, alerts, run controls, experiment history, and automated tests.",
          "Repository: github.com/somtri/run_scope.git",
        ],
      },
      {
        heading: "SmartSignal - Stock Movement Forecasting Pipeline",
        meta: "Python / Random Forest / Streamlit / Dec 2025",
        details: [
          "Built a Random Forest stock-direction pipeline using 26 engineered price, volume, volatility, momentum, and sentiment features with automated yfinance ingestion, preprocessing, and model persistence.",
          "Implemented leakage-aware chronological holdout and expanding-window validation, achieving 63.3% walk-forward accuracy on a deterministic market simulation, with Streamlit dashboards for ROC AUC, equity curves, confidence, and feature importance.",
          "Repository: github.com/somtri/smart_signal.git",
        ],
      },
    ],
  },
  {
    title: "Technical Skills",
    items: [
      {
        heading: "Languages",
        meta: "Software / ML / Research",
        details: [
          "Python, C++, Java, Rust, TypeScript/JavaScript, SQL, R",
        ],
      },
      {
        heading: "Frameworks and tools",
        meta: "Research systems / application development",
        details: [
          "PyTorch, scikit-learn, NumPy, Pandas, OpenCV, React, Streamlit, Axum, Tokio, SQLx, SQLite, Docker, Git, Linux, CUDA, pytest, GitHub Actions",
        ],
      },
      {
        heading: "Core competencies",
        meta: "Methods",
        details: [
          "Machine Learning, Computer Vision, Time Series Forecasting, Statistical Modeling, Feature Engineering, Regression, Classification, Tabular Foundation Models, REST APIs, WebSockets, Batched Inference, Anomaly Detection, Reproducible ML Experiments",
        ],
      },
    ],
  },
];
