const ftm = require("./ftm.js");
const ftm_with_moratoriums = require("./ftm_with_moratoriums.js");

const bridge = require("./bridge.js");
const nj = require("./nj.js");
let parameters = {
  full_automation_requirements_training: 3e29,
  flop_gap_training: 100.0,
  goods_vs_rnd_requirements_training: 3.0,
  full_automation_requirements_runtime: 1.66667e16,
  flop_gap_runtime: 10.0,
  goods_vs_rnd_requirements_runtime: 100.0,
  runtime_training_tradeoff: 1.5,
  runtime_training_max_tradeoff: 30.0,
  labour_substitution_goods: -0.5,
  labour_substitution_rnd: -0.5,
  capital_substitution_goods: -0.4,
  capital_substitution_rnd: -0.25,
  research_experiments_substitution_software: -0.01,
  compute_software_rnd_experiments_efficiency: 0.4,
  hardware_returns: 5.2,
  software_returns: 2.5,
  hardware_performance_ceiling: 1e26,
  software_ceiling: 1000000000000.0,
  rnd_parallelization_penalty: 0.7,
  hardware_delay: 1.0,
  frac_capital_hardware_rnd_growth: 0.01,
  frac_labour_hardware_rnd_growth: 0.01,
  frac_compute_hardware_rnd_growth: 0.01,
  frac_labour_software_rnd_growth: 0.18,
  frac_compute_software_rnd_growth: 0.18,
  frac_gwp_compute_growth: 0.19,
  frac_compute_training_growth: 0.547528364331348,
  frac_capital_hardware_rnd_growth_rampup: 0.14,
  frac_labour_hardware_rnd_growth_rampup: 0.14,
  frac_compute_hardware_rnd_growth_rampup: 0.6699999999999999,
  frac_labour_software_rnd_growth_rampup: 0.22,
  frac_compute_software_rnd_growth_rampup: 0.6699999999999999,
  frac_gwp_compute_growth_rampup: 0.19,
  frac_compute_training_growth_rampup: 1.1,
  frac_capital_hardware_rnd_ceiling: 0.03,
  frac_labour_hardware_rnd_ceiling: 0.03,
  frac_compute_hardware_rnd_ceiling: 0.2,
  frac_labour_software_rnd_ceiling: 0.03,
  frac_compute_software_rnd_ceiling: 0.2,
  frac_gwp_compute_ceiling: 0.1,
  frac_compute_training_ceiling: 0.1,
  initial_frac_capital_hardware_rnd: 0.002,
  initial_frac_labour_hardware_rnd: 0.002,
  initial_frac_compute_hardware_rnd: 0.002,
  initial_frac_labour_software_rnd: 0.0002,
  initial_frac_compute_software_rnd: 0.0002,
  initial_biggest_training_run: 3e24,
  ratio_initial_to_cumulative_input_hardware_rnd: 0.047,
  ratio_initial_to_cumulative_input_software_rnd: 0.2,
  initial_hardware_production: 1e28,
  ratio_hardware_to_initial_hardware_production: 2.0,
  initial_buyable_hardware_performance: 1.5e17,
  initial_gwp: 85000000000000.0,
  initial_population: 4000000000.0,
  initial_cognitive_share_goods: 0.5,
  initial_cognitive_share_hardware_rnd: 0.7,
  initial_compute_share_goods: 0.01,
  initial_compute_share_rnd: 0.01,
  initial_experiment_share_software_rnd: 0.3,
  rampup_trigger: 0.06,
  initial_capital_growth: 0.0275,
  labour_growth: 0.01,
  tfp_growth: 0.01,
  compute_depreciation: 0.2,
  money_cap_training_before_wakeup: 4000000000.0,
  training_requirements_steepness: 0.0,
  runtime_requirements_steepness: 0.0,
  runtime_training_tradeoff_enabled: true,
  t_start: 2022,
  t_end: 2040,
};

// Default largest training run compute
const sim = ftm.run_simulation(
  bridge.transform_python_to_js_params(parameters)
);
console.log("Default metrics");
console.log(sim.get_takeoff_metrics());
let metrics = sim.get_timeline_metrics();

years = sim.get_thread("t_year");
biggest_training_runs = sim.get_thread("biggest_training_run");

// With moratoriums

const moratoriums = [
  [2023, 2023.5],
  [2027, 2028],
];

const simMoratoriums = ftm_with_moratoriums.run_simulation(
  bridge.transform_python_to_js_params(parameters),
  moratoriums
);

console.log("Moratorium metrics");
console.log(simMoratoriums.get_takeoff_metrics());
let moratoriumMetrics = simMoratoriums.get_timeline_metrics();

// const moratorium_years = simMoratoriums.get_thread("t_year");
const moratorium_biggest_training_runs = simMoratoriums.get_thread(
  "biggest_training_run"
);

// Passing data to python
args = {
  years: years,
  flops: biggest_training_runs,
  sub_agi_year: metrics.sub_agi_year,
  agi_year: metrics["automation_rnd_100%"],
  wakeup: metrics.rampup_start,
  moratorium_flops: moratorium_biggest_training_runs,
};
const { spawn } = require("child_process");

const pythonProcess = spawn("python", ["./plot.py"]);

pythonProcess.stdout.on("data", (data) => {
  console.log(`Output from Python: ${data}`);
});

pythonProcess.stderr.on("data", (data) => {
  console.error(`Error from Python: ${data}`);
});

pythonProcess.on("close", (code) => {
  console.log(`Python process exited with code ${code}`);
});

// Call the Python function
pythonProcess.stdin.write(`${JSON.stringify(args)}\n`);
