import { Component } from '@angular/core';
@Component({
  selector: 'app-strategic-achievements',
  standalone: true,
  imports: [],
  template: `
    <section class="py-20 bg-th-bg-alt">
      <div class="container mx-auto px-6">
        <!-- Section Header -->
        <div class="text-center mb-16">
          <div class="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full border border-primary/20 mb-6">
            <span class="text-sm font-medium text-primary">Proven Track Record</span>
          </div>
          <h2 class="text-4xl md:text-5xl font-bold text-th-text mb-6">
            Strategic Achievements That
            <span class="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {{ ' ' }}Exceed Big 4 Standards
            </span>
          </h2>
          <p class="text-xl text-th-text-2 max-w-3xl mx-auto">
            Quantifiable results that demonstrate superior value delivery compared to traditional consulting firms
          </p>
        </div>

        <!-- Achievements Grid -->
        <div class="grid lg:grid-cols-3 gap-8 mb-16">
          <!-- Achievement 1: Revenue Growth -->
          <div class="bg-th-card rounded-2xl shadow-xl p-8 border-t-4 border-green-500 hover:shadow-2xl transition-all group">
            <div class="mb-6">
              <div class="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-th-text mb-2">Revenue Excellence</h3>
              <p class="text-th-text-2">Western Region Performance</p>
            </div>

            <div class="space-y-4">
              <div class="flex justify-between items-center pb-2 border-b border-th-border">
                <span class="text-th-text-2">Annual Bookings</span>
                <span class="text-2xl font-bold text-green-600">SAR 125M</span>
              </div>
              <div class="flex justify-between items-center pb-2 border-b border-th-border">
                <span class="text-th-text-2">Collections Rate</span>
                <span class="text-2xl font-bold text-green-600">88%</span>
              </div>
              <div class="flex justify-between items-center pb-2 border-b border-th-border">
                <span class="text-th-text-2">Profit Multiplier</span>
                <span class="text-2xl font-bold text-green-600">5x</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-th-text-2">National Ranking</span>
                <span class="text-2xl font-bold text-green-600">#1</span>
              </div>
            </div>

            <div class="mt-6 p-4 bg-green-50 rounded-lg">
              <p class="text-sm text-green-800">
                <span class="font-semibold">Impact:</span> Outperformed all other regions nationwide while maintaining highest profit margins in company history
              </p>
            </div>
          </div>

          <!-- Achievement 2: Oracle Distribution -->
          <div class="bg-th-card rounded-2xl shadow-xl p-8 border-t-4 border-blue-500 hover:shadow-2xl transition-all group">
            <div class="mb-6">
              <div class="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-th-text mb-2">Oracle Leadership</h3>
              <p class="text-th-text-2">KSA Distribution Excellence</p>
            </div>

            <div class="space-y-4">
              <div class="flex justify-between items-center pb-2 border-b border-th-border">
                <span class="text-th-text-2">Market Position</span>
                <span class="text-2xl font-bold text-blue-600">#1</span>
              </div>
              <div class="flex justify-between items-center pb-2 border-b border-th-border">
                <span class="text-th-text-2">Partner Growth</span>
                <span class="text-2xl font-bold text-blue-600">+25%</span>
              </div>
              <div class="flex justify-between items-center pb-2 border-b border-th-border">
                <span class="text-th-text-2">Programs Launched</span>
                <span class="text-2xl font-bold text-blue-600">12</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-th-text-2">Enablement Sessions</span>
                <span class="text-2xl font-bold text-blue-600">48</span>
              </div>
            </div>

            <div class="mt-6 p-4 bg-blue-50 rounded-lg">
              <p class="text-sm text-blue-800">
                <span class="font-semibold">Impact:</span> Maintained Oracle's #1 distributor status while expanding market reach beyond Big 4 capabilities
              </p>
            </div>
          </div>

          <!-- Achievement 3: Vision 2030 Alignment -->
          <div class="bg-th-card rounded-2xl shadow-xl p-8 border-t-4 border-purple-500 hover:shadow-2xl transition-all group">
            <div class="mb-6">
              <div class="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"></path>
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-th-text mb-2">Vision 2030 Delivery</h3>
              <p class="text-th-text-2">National Strategy Implementation</p>
            </div>

            <div class="space-y-4">
              <div class="flex justify-between items-center pb-2 border-b border-th-border">
                <span class="text-th-text-2">Gov Projects</span>
                <span class="text-2xl font-bold text-purple-600">47</span>
              </div>
              <div class="flex justify-between items-center pb-2 border-b border-th-border">
                <span class="text-th-text-2">KPI Achievement</span>
                <span class="text-2xl font-bold text-purple-600">112%</span>
              </div>
              <div class="flex justify-between items-center pb-2 border-b border-th-border">
                <span class="text-th-text-2">Digital Transformation</span>
                <span class="text-2xl font-bold text-purple-600">15</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-th-text-2">Compliance Rate</span>
                <span class="text-2xl font-bold text-purple-600">100%</span>
              </div>
            </div>

            <div class="mt-6 p-4 bg-purple-50 rounded-lg">
              <p class="text-sm text-purple-800">
                <span class="font-semibold">Impact:</span> Direct contribution to Saudi Arabia's digital transformation exceeding Vision 2030 targets
              </p>
            </div>
          </div>
        </div>

        <!-- Comparison with Big 4 -->
        <div class="bg-gradient-to-br from-surface-dark to-brand-dark rounded-3xl p-12 text-white">
          <h3 class="text-3xl font-bold mb-8 text-center">How We Exceed Big 4 Standards</h3>

          <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div class="text-center">
              <div class="text-5xl font-bold mb-2 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                3x
              </div>
              <div class="text-lg font-semibold mb-1">Faster Delivery</div>
              <div class="text-sm text-th-text-3">vs. Big 4 average timeline</div>
            </div>

            <div class="text-center">
              <div class="text-5xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                40%
              </div>
              <div class="text-lg font-semibold mb-1">Cost Efficiency</div>
              <div class="text-sm text-th-text-3">Lower than Big 4 rates</div>
            </div>

            <div class="text-center">
              <div class="text-5xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                100%
              </div>
              <div class="text-lg font-semibold mb-1">Local Compliance</div>
              <div class="text-sm text-th-text-3">KSA regulatory expertise</div>
            </div>

            <div class="text-center">
              <div class="text-5xl font-bold mb-2 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                24/7
              </div>
              <div class="text-lg font-semibold mb-1">Direct Access</div>
              <div class="text-sm text-th-text-3">Senior consultant availability</div>
            </div>
          </div>

          <div class="mt-12 p-6 bg-th-card/10 backdrop-blur-sm rounded-xl border border-white/20">
            <p class="text-center text-lg">
              <span class="font-semibold">The Dogan Advantage:</span> While Big 4 firms deploy junior consultants at senior rates,
              you get direct access to a senior executive with 20+ years of experience,
              ensuring faster, more accurate, and cost-effective solutions.
            </p>
          </div>
        </div>

        <!-- ROI Calculator Preview -->
        <div class="mt-16 text-center">
          <div class="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg transition-all cursor-pointer group">
            <span>Calculate Your ROI vs. Big 4 Consulting</span>
            <svg class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
            </svg>
          </div>
        </div>
      </div>
    </section>
  `
})
export class StrategicAchievementsComponent {}