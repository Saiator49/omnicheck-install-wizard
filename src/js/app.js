// Shell elements
const wizard      = document.getElementById('wizard');
const welcome     = document.getElementById('welcome');
const sectionRoot = document.getElementById('sectionRoot');
const progressBar = document.getElementById('progressBar');
const nextBtn     = document.getElementById('nextBtn');
const prevBtn     = document.getElementById('prevBtn');

// Tabs
const tabs = {
  hardware:   document.getElementById('tabHardware'),
  contact:    document.getElementById('tabContact'),
  preinstall: document.getElementById('tabPreinstall'),
  software:   document.getElementById('tabSoftware'),
  legacy:     document.getElementById('tabLegacy'),
};

// Flow order
const sectionOrder = ['hardware','contact','preinstall','software','legacy'];
const labels = {
  hardware: 'Hardware Setup',
  contact: 'Contact Support',
  preinstall: 'Pre-Installation Warning',
  software: 'Software Installation',
  legacy: 'Legacy Migration'
};

// State
let currentSection = 'hardware';
let currentStepIndex = 0;
let userClickedTab = false;
const stepIndexBySection = { hardware:0, contact:0, preinstall:0, software:0, legacy:0 };

function stepsInCurrent(){
  return document.querySelectorAll(`#${currentSection}Section .step`);
}

function markActiveTab(){
  Object.entries(tabs).forEach(([name, el]) => {
    if (!el) return;
    el.classList.toggle('active', name === currentSection);
  });
}

async function loadSection(name){
  // Load HTML fragment into sectionRoot
  const res = await fetch(`/src/sections/${name}.html`, { cache: 'no-cache' });
  if (!res.ok){
    sectionRoot.innerHTML = `<p style="color:#b22222">Failed to load section: ${name}</p>`;
    return;
  }
  const html = await res.text();
  sectionRoot.innerHTML = html;
  currentSection = name;

  // restore last step for this section
  currentStepIndex = stepIndexBySection[name] || 0;

  activateStep();
}

function activateStep(){
  // Toggle active section container id must be like "#hardwareSection"
  const sectionEl = document.getElementById(`${currentSection}Section`);
  // Ensure only this section is marked active
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  if (sectionEl) sectionEl.classList.add('active');

  // Steps visibility
  const steps = stepsInCurrent();
  steps.forEach((s, i) => s.classList.toggle('active', i === currentStepIndex));

  // Progress
  if (progressBar && steps.length){
    progressBar.style.width = ((currentStepIndex + 1) / steps.length) * 100 + '%';
  } else if (progressBar){
    progressBar.style.width = '0%';
  }

  // Prev
  const atVeryStart = currentSection === 'hardware' && currentStepIndex === 0;
  prevBtn.disabled = atVeryStart;
  prevBtn.style.opacity = atVeryStart ? 0.5 : 1;

  // Next
  const atLast = steps.length && currentStepIndex === steps.length - 1;
  if (atLast){
    const idx = sectionOrder.indexOf(currentSection);
    const nextSection = sectionOrder[idx + 1];
    if (nextSection){
      nextBtn.textContent = `Go to ${labels[nextSection]}`;
      nextBtn.classList.remove('done'); nextBtn.classList.add('next');
      nextBtn.onclick = async () => {
        stepIndexBySection[currentSection] = currentStepIndex;
        await loadSection(nextSection);
      };
    } else {
      nextBtn.textContent = 'Done';
      nextBtn.classList.remove('next'); nextBtn.classList.add('done');
      nextBtn.onclick = () => alert('Installation walkthrough complete!');
    }
  } else {
    nextBtn.textContent = 'Next';
    nextBtn.classList.add('next'); nextBtn.classList.remove('done');
    nextBtn.onclick = nextStep;
  }

  // Tab state
  markActiveTab();
}
function startGuide(){
  const welcome = document.getElementById('welcome');
  const wizard  = document.getElementById('wizard');

  if (welcome) welcome.style.display = 'none';
  if (wizard)  wizard.style.display  = 'block';

  // load first section
  // (keep your existing loadSection logic)
  currentSection = 'hardware';
  currentStepIndex = 0;
  stepIndexBySection.hardware = 0;
  loadSection('hardware');
}
// Make sure the button is wired even if CSP blocks inline handlers
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('startBtn');
  if (btn) btn.addEventListener('click', startGuide);
});


function nextStep(){
  const steps = stepsInCurrent();
  if (currentStepIndex < steps.length - 1){
    currentStepIndex++;
    stepIndexBySection[currentSection] = currentStepIndex;
    activateStep();
    return;
  }
  // end of section → auto advance
  const idx = sectionOrder.indexOf(currentSection);
  const nextSection = sectionOrder[idx + 1];
  if (nextSection){
    stepIndexBySection[currentSection] = currentStepIndex;
    loadSection(nextSection);
  }
}

function prevStep(){
  const steps = stepsInCurrent();
  if (currentStepIndex > 0){
    currentStepIndex--;
    stepIndexBySection[currentSection] = currentStepIndex;
    activateStep();
    return;
  }
  // First step of section → go to previous section's last step
  const idx = sectionOrder.indexOf(currentSection);
  const prevSection = sectionOrder[idx - 1];
  if (prevSection){
    stepIndexBySection[currentSection] = currentStepIndex;
    loadSection(prevSection).then(() => {
      const prevSteps = stepsInCurrent();
      currentStepIndex = Math.max(0, prevSteps.length - 1);
      stepIndexBySection[prevSection] = currentStepIndex;
      activateStep();
    });
  }
}
 
prevBtn.addEventListener('click', prevStep);

// Tab listeners
Object.entries(tabs).forEach(([name, el]) => {
  if (!el) return;
  el.addEventListener('click', async () => {
    userClickedTab = true;
    // If hardware tab is clicked explicitly, reset to step 0
    if (name === 'hardware') {
      stepIndexBySection.hardware = 0;
    }
    await loadSection(name);
  });
});

// Start button
document.getElementById('startBtn').addEventListener('click', async () => {
  if (welcome) welcome.style.display = 'none';
  if (wizard) wizard.style.display = 'block';
  await loadSection('hardware');
});


// Initial (optional): you can show welcome first; nothing else to do.
