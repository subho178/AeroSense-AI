# 🌬️ AeroSense AI

> **GenAI-Powered Winter Smog Navigation, Indoor Air Quality (IAQ) & Community Climate Resilience Platform**

[![Vite](https://img.shields.io/badge/Vite-6.1-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-2.5_Flash-8E75C2?style=for-the-badge&logo=google-gemini&logoColor=white)](https://ai.google.dev/)
[![Vitest](https://img.shields.io/badge/Tests-14%2F14_Passing-brightgreen?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

---

## 🎯 Your Chosen Vertical

**Vertical**: **Winter Smog, Public Health & Sustainable Urban Living**

- **Target Persona**: Urban families, parents with infants/toddlers, individuals with asthma/COPD, seniors with cardiovascular sensitivity, and daily commuters in severe air pollution hotspots.
- **Core Challenge**: During severe winter episodes, shallow **thermal inversion layers** trap combustion particulate matter ($PM_{2.5}$ & $PM_{10} > 300 - 500+\,\mu g/m^3$) at ground level. Generic weather apps simply say *"stay indoors"*, leaving families without actionable protection against indoor infiltration, cooking spikes, or unavoidable commutes.
- **AeroSense AI Mission**: Deliver hyper-local, medically grounded, low-emission daily routines, open-source indoor air engineering (DIY Corsi-Rosenthal boxes), multimodal skyline/room diagnostics, and exact quantified health impact metrics.

---

## 🧠 Approach and Logic

AeroSense AI combines **atmospheric physics**, **aerosol filtration engineering**, **clinical pulmonology**, and **state-of-the-art Generative AI** into a unified, responsive platform:

1. **Diurnal Inversion Cycle Modeling**:
   - Rather than static daily averages, AeroSense models the 24-hour winter boundary layer curve. Ground radiative cooling creates severe particulate caps during morning (06:30–10:30) and night (19:30–23:30).
   - Crucially, it identifies the **"Midday Solar Breakthrough Window" (13:00–15:30)** when sunlight warming temporarily lifts the inversion cap, enabling safe 15-minute cross-ventilation to flush indoor $CO_2$ without catastrophic particulate intrusion.

2. **Vulnerability-First Adaptive Logic**:
   - Pulmonological evidence shows infants breathe at $2\times$ adult rates, and heavy coarse particulate settles within 2 feet of the floor. AeroSense prioritizes crib elevation, pre-sleep air scrubbing, and damp microfiber mopping.
   - For asthma patients, the logic cross-references temperature and $NO_2$, prescribing rescue inhaler warming and certified N95 silicone sealing.

3. **Open-Source Indoor Air Quality (IAQ) Engineering**:
   - Commercial HEPA purifiers (\$300–\$650) are financially out of reach for many families. AeroSense integrates an interactive **Corsi-Rosenthal Box Studio** validating that a 20-inch box fan paired with 4 MERV 13 filters delivers **550+ CFM CADR for under \$75 / ₹2,000** (78% savings) with an aerodynamic cardboard shroud that eliminates eddy backflow.

4. **Dual-Mode GenAI Architecture**:
   - **Live Mode**: Calls Google Gemini 2.5 Flash with structured JSON schemas and context compression.
   - **Offline / Zero-Config Mode**: Features an embedded, scientifically calibrated neural heuristic engine ensuring instant, 100% turnkey responses without requiring an API key.

---

## ⚙️ How the Solution Works

```mermaid
flowchart TD
    subgraph UI ["User Experience (React 18 + Vite + Tailwind CSS)"]
        A[Smog Intelligence & Particle Canvas]
        B[GenAI Copilot Chat Assistant]
        C[Low-Emission Routine Planner]
        D[DIY Corsi-Rosenthal Box Studio]
        E[Multimodal Vision Smog Scanner]
        F[Health & Carbon Impact Engine]
        G[Community Smog SOS Hub]
    end

    subgraph CoreEngine ["Services & Physics Engine"]
        AQI[Diurnal Inversion Telemetry Engine]
        MathEngine[Biometric Alveolar & Berkeley Earth Math]
        VoiceService[Web Speech Audio Briefings]
        SecurityUtil[Client-Side Sanitization & Key Validation]
    end

    subgraph GenAI ["Google Gemini 2.5 Flash / Neural Fallback"]
        ChatGen[Conversational Copilot Tool]
        RoutineGen[Adaptive Daily Routine Tool]
        VisionGen[Optical Haze & Draft Diagnostic Tool]
        LocalFallback[Scientifically Calibrated Neural Fallback]
    end

    A --> AQI
    B --> ChatGen
    C --> RoutineGen
    D --> MathEngine
    E --> VisionGen
    F --> MathEngine
    G --> AQI
    ChatGen -.-> LocalFallback
    RoutineGen -.-> LocalFallback
    VisionGen -.-> LocalFallback
```

- **Step 1: Hyper-Local Telemetry Ingestion**: Users select from 28+ Indian cities across 18 states/UTs (or international benchmarks). The system loads coordinates, real-time/calibrated $PM_{2.5}, PM_{10}, NO_2$, and computes the diurnal inversion curve.
- **Step 2: Physics-Based Particle Atmospheric Canvas**: An interactive canvas renders particulate motion and brown haze proportional to AQI. Users can hover to simulate air filtration vortex dispersal.
- **Step 3: GenAI Low-Emission Routine Planner**: Users toggle family vulnerabilities (infants, asthma, seniors, commuters, pets). Gemini synthesizes hour-by-hour schedules with dual outputs: *Indoor Air Quality Hack* + *Sustainable Low-Emission Alternative*.
- **Step 4: DIY Corsi-Rosenthal CADR Studio**: Users input room dimensions ($ft^2$ & ceiling height). The engine calculates Clean Air Delivery Rate (CADR in CFM), Air Changes per Hour (ACH), economic ROI vs commercial HEPA, and provides an interactive 4-step assembly blueprint.
- **Step 5: Multimodal Vision Smog Scanner**: Users upload outdoor window or indoor kitchen photos. The client compresses the image by 98% locally; Gemini Vision diagnoses optical haze extinction, landmark visibility distance, and draft bypass points.
- **Step 6: Direct Impact Engine & Community Hub**: Quantifies avoided alveolar $PM_{2.5}$ deposition, non-smoked cigarette equivalents, and household $CO_2$ offsets, while generating instant copyable WhatsApp community alerts.
- **Step 7: Conversational AI Copilot**: Accessible via dedicated tab or persistent floating widget across all pages, offering instant answers and hands-free voice synthesis.

---

## 🔬 Any Assumptions Made

To ensure scientific rigor, transparency, and computational reproducibility, AeroSense AI operates on the following documented assumptions:

1. **Ambient-to-Indoor Infiltration Rate**:
   - In unsealed urban residential buildings, baseline indoor air without filtration tracks ambient outdoor particulate at an assumed **$65\text{--}70\%$ infiltration ratio**. With weatherstripped windows and continuous MERV 13/HEPA filtration, indoor particulate drops by **$85\text{--}92\%$** ($<25\,\mu g/m^3$).

2. **Berkeley Earth Cigarette Equivalence Formulation**:
   - Based on peer-reviewed epidemiological research by Prof. Richard Muller (Berkeley Earth): Breathing $22\,\mu g/m^3$ of $PM_{2.5}$ continuously over 24 hours delivers pulmonary and cardiovascular stress equivalent to **1 standard cigarette**:
     $$\text{Cigarettes Avoided} = \frac{\Delta PM_{2.5} \, (\mu g/m^3) \times (\text{Hours} / 24)}{22}$$

3. **Human Minute Ventilation Volumes ($V_E$)**:
   - Inhaled particulate mass is calculated using tidal volume and respiratory rate ($V_E = V_T \times f$):
     - *Resting Adult / Sleep*: $7.5\text{ L/min}$
     - *Light Activity / Commute*: $16.0\text{ L/min}$
     - *Vigorous Exertion / Cycling*: $38.0\text{ L/min}$
     - *Infants / Toddlers*: Adjusted for developing alveolar surface area ($2.2\times$ vulnerability factor).

4. **Corsi-Rosenthal Box Airflow & CADR**:
   - A standard 20-inch, 3-speed box fan paired with four 20"x20"x2" MERV 13 filters and a 15-inch circular cardboard shroud achieves **$550\text{ CFM}$ CADR** on Speed 1/2 with a static pressure drop $<0.15\text{ in. w.g.}$, maintaining $>4.0\text{ ACH}$ in rooms up to $600\text{ sq ft}$.

5. **Carbon & Particulate Offset Factors**:
   - Shifting from solo petrol car to shared transit/carpool saves $\sim 3.6\text{ kg } CO_2$ and $18\text{g}$ tailpipe PM/day.
   - Shifting from kerosene/biomass space heating to an inverter heat pump saves $\sim 4.2\text{ kg } CO_2$/day.
   - Mature urban tree carbon sequestration factor is standardized at $21.7\text{ kg } CO_2/\text{year}$.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | React 18.3, Vite 6.1 |
| **Styling & Design System** | Tailwind CSS 3.4, Custom Glassmorphism, CSS Variables |
| **Icons & Typography** | Lucide-React, Plus Jakarta Sans, JetBrains Mono |
| **GenAI Orchestration** | Google Gemini 2.5 Flash (`@google/genai` API architecture) |
| **Telemetry Ingestion** | Open-Meteo Air Quality API, WAQI, Inversion Diurnal Model |
| **Audio Synthesis** | Web Speech API (`SpeechSynthesisUtterance`) |
| **Testing Harness** | Vitest 5.1 (14 automated unit tests) |

---

## 🧪 Automated Testing

AeroSense AI includes a complete automated test harness covering biometric calculations, air quality telemetry, domain models, and security utilities.

To run tests:
```bash
npm test
```

### Test Suite Execution Output:
```text
 ✓ src/tests/impactMath.test.js (4 tests)
   - computes inhaled PM2.5 reduction based on respiratory rate
   - adapts minute ventilation rate for vigorous exercise
   - calculates Berkeley Earth equivalent cigarettes avoided
   - calculates household carbon savings and tree equivalents
 ✓ src/tests/security.test.js (4 tests)
   - validates Google Gemini API key format correctly
   - sanitizes malicious script tags and HTML injection vectors
   - safely extracts and parses JSON from markdown code blocks
   - enforces file type whitelist and size constraints on image uploads
 ✓ src/tests/aqiService.test.js (2 tests)
   - maps AQI values to standardized EPA & CPCB health alert categories
   - generates 24-hour diurnal curve reflecting inversion physics
 ✓ src/tests/constants.test.js (4 tests)
   - validates 28+ Indian & international city inversion datasets
   - validates clinical vulnerability risk multipliers
   - verifies Corsi-Rosenthal filter configurations and ROI
   - verifies clean commute alternatives and positive carbon offsets

 Test Files  4 passed (4)
      Tests  14 passed (14)
   Duration  1.2s (100% Pass)
```

---

## 🔒 Security & Safe Implementation

- **Client-Side Key Isolation**: Google Gemini API keys are validated using `/^AIzaSy[A-Za-z0-9_-]{30,45}$/` and stored strictly in browser `localStorage`. No keys are sent to intermediary servers.
- **Image Upload Validation**: Files are checked against MIME whitelists (`image/jpeg`, `image/png`, `image/webp`) with a $10\text{ MB}$ size cap.
- **Client-Side Compression**: Images are downscaled locally to $800\times 800\text{ px}$ before base64 transmission, protecting user bandwidth and preventing browser memory exhaustion.
- **XSS & Injection Protection**: User inputs and community broadcast strings are sanitized; JSON parsing handles balanced LLM responses safely without `eval`.
- **Runtime Error Boundary**: Wrapped in `ErrorBoundary.jsx` to gracefully recover from any unexpected rendering errors.

---

## 🏁 Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm or pnpm

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/subho178/AeroSense-AI.git
   cd AeroSense-AI
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **Run production build:**
   ```bash
   npm run build
   ```

5. **(Optional) Configure Gemini API Key:**
   - Click the **"AI Model"** button in the top navigation bar.
   - Enter your free API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
   - *Note: AeroSense AI works seamlessly without an API key using its built-in calibrated atmospheric neural engine.*

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
