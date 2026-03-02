import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-premium-residency',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="relative py-24 bg-gradient-to-br from-amber-50 via-th-card to-green-50 overflow-hidden">
      <!-- Saudi Vision 2030 Pattern Background -->
      <div class="absolute inset-0 opacity-5">
        <div class="absolute inset-0" style="background-image: url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23006C35&quot; fill-opacity=&quot;0.4&quot;%3E%3Cpath d=&quot;M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"></div>
      </div>

      <div class="container mx-auto px-6 relative z-10">
        <!-- Premium Badge Animation -->
        <div class="absolute -top-10 left-1/2 transform -translate-x-1/2">
          <div class="relative">
            <div class="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full blur-3xl opacity-30 animate-pulse"></div>
            <div class="relative bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 rounded-full p-1">
              <div class="bg-th-card rounded-full p-4">
                <svg class="w-12 h-12 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Header -->
        <div class="text-center mb-16 mt-8">
          <div class="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 rounded-full mb-6 shadow-lg">
            <svg class="w-5 h-5 mr-2 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
            <span class="text-white font-semibold">Kingdom of Saudi Arabia - Premium Resident</span>
          </div>

          <h2 class="text-5xl md:text-6xl font-bold text-th-text mb-6">
            Premium Residency
            <span class="block text-3xl mt-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Elite Technical Qualification Status
            </span>
          </h2>

          <p class="text-xl text-th-text-2 max-w-3xl mx-auto">
            Recognized by the Kingdom of Saudi Arabia for exceptional technical expertise and contribution to Vision 2030
          </p>
        </div>

        <!-- Premium ID Card Showcase -->
        <div class="max-w-5xl mx-auto mb-16">
          <div class="bg-th-card rounded-3xl shadow-2xl p-8 border-4 border-gradient">
            <div class="grid lg:grid-cols-2 gap-12 items-center">
              <!-- ID Card Visual -->
              <div class="relative">
                <div class="bg-gradient-to-br from-green-50 to-amber-50 rounded-2xl p-8 border-2 border-green-200">
                  <div class="flex items-start justify-between mb-6">
                    <div>
                      <div class="text-sm font-semibold text-green-700 mb-1">المملكة العربية السعودية</div>
                      <div class="text-xs text-th-text-2">KINGDOM OF SAUDI ARABIA</div>
                    </div>
                    <div class="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                      PREMIUM
                    </div>
                  </div>

                  <div class="mb-6">
                    <div class="w-24 h-24 bg-gradient-to-br from-th-bg-tert to-th-border rounded-lg mb-4 flex items-center justify-center">
                      <svg class="w-16 h-16 text-th-text-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                    </div>
                    <h3 class="text-2xl font-bold text-th-text mb-1">AHMET DOĞAN</h3>
                    <p class="text-sm text-th-text-2">أحمد دوغان</p>
                  </div>

                  <div class="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div class="text-xs text-th-text-3 mb-1">NATIONALITY</div>
                      <div class="font-semibold text-th-text">Turkey</div>
                    </div>
                    <div>
                      <div class="text-xs text-th-text-3 mb-1">ID NUMBER</div>
                      <div class="font-semibold text-th-text">2406775383</div>
                    </div>
                    <div>
                      <div class="text-xs text-th-text-3 mb-1">EXPIRY DATE</div>
                      <div class="font-semibold text-th-text">03/01/2030</div>
                    </div>
                    <div>
                      <div class="text-xs text-th-text-3 mb-1">STATUS</div>
                      <div class="font-semibold text-green-600">ACTIVE</div>
                    </div>
                  </div>

                  <div class="mt-6 pt-4 border-t border-green-200">
                    <div class="flex items-center justify-between">
                      <div class="text-xs text-th-text-3">PREMIUM RESIDENT IDENTITY</div>
                      <div class="flex space-x-2">
                        <div class="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                          <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.1 0-1.99.9-1.99 2L3 20c0 1.1.89 2 1.99 2H19c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
                          </svg>
                        </div>
                        <div class="w-8 h-8 bg-amber-100 rounded flex items-center justify-center">
                          <svg class="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Holographic Effect -->
                <div class="absolute -inset-1 bg-gradient-to-r from-green-600 via-amber-500 to-green-600 rounded-2xl opacity-20 blur animate-pulse"></div>
              </div>

              <!-- Premium Benefits -->
              <div>
                <h3 class="text-2xl font-bold text-th-text mb-6">
                  Premium Residency Advantages
                </h3>

                <div class="space-y-4">
                  <div class="flex items-start">
                    <div class="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                      <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 class="font-semibold text-th-text mb-1">Permanent Residency Rights</h4>
                      <p class="text-sm text-th-text-2">Long-term stability with renewable premium status until 2030</p>
                    </div>
                  </div>

                  <div class="flex items-start">
                    <div class="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                      <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 class="font-semibold text-th-text mb-1">Business Ownership Rights</h4>
                      <p class="text-sm text-th-text-2">100% ownership of companies and real estate in Saudi Arabia</p>
                    </div>
                  </div>

                  <div class="flex items-start">
                    <div class="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                      <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 class="font-semibold text-th-text mb-1">Government Contract Eligibility</h4>
                      <p class="text-sm text-th-text-2">Direct participation in Vision 2030 mega-projects</p>
                    </div>
                  </div>

                  <div class="flex items-start">
                    <div class="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                      <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 class="font-semibold text-th-text mb-1">Elite Network Access</h4>
                      <p class="text-sm text-th-text-2">Exclusive access to premium resident business community</p>
                    </div>
                  </div>
                </div>

                <div class="mt-8 p-6 bg-gradient-to-br from-amber-50 to-green-50 rounded-xl border border-amber-200">
                  <div class="flex items-center mb-3">
                    <svg class="w-6 h-6 text-amber-600 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <h4 class="font-semibold text-th-text">Technical Excellence Recognition</h4>
                  </div>
                  <p class="text-sm text-th-text-2">
                    Premium residency granted based on exceptional technical qualifications and proven contribution
                    to Saudi Arabia's digital transformation and Vision 2030 objectives.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Comparison with Standard Residency -->
        <div class="bg-th-card rounded-2xl shadow-xl p-8 mb-16">
          <h3 class="text-2xl font-bold text-th-text mb-8 text-center">Premium vs Standard Residency</h3>

          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b-2 border-th-border">
                  <th class="text-left py-4 px-4 font-semibold text-th-text">Feature</th>
                  <th class="text-center py-4 px-4">
                    <div class="inline-flex items-center px-3 py-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full text-sm font-semibold">
                      Premium Resident
                    </div>
                  </th>
                  <th class="text-center py-4 px-4">
                    <div class="inline-flex items-center px-3 py-1 bg-th-bg-alt0 text-white rounded-full text-sm font-semibold">
                      Standard Resident
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr class="border-b border-th-border-lt">
                  <td class="py-4 px-4 text-th-text-2">Residency Duration</td>
                  <td class="text-center py-4 px-4">
                    <span class="text-green-600 font-semibold">Permanent (Renewable)</span>
                  </td>
                  <td class="text-center py-4 px-4 text-th-text-3">1-2 Years</td>
                </tr>
                <tr class="border-b border-th-border-lt bg-th-bg-alt">
                  <td class="py-4 px-4 text-th-text-2">Business Ownership</td>
                  <td class="text-center py-4 px-4">
                    <span class="text-green-600 font-semibold">100% Ownership</span>
                  </td>
                  <td class="text-center py-4 px-4 text-th-text-3">Limited/Sponsor Required</td>
                </tr>
                <tr class="border-b border-th-border-lt">
                  <td class="py-4 px-4 text-th-text-2">Real Estate Rights</td>
                  <td class="text-center py-4 px-4">
                    <span class="text-green-600 font-semibold">Full Ownership</span>
                  </td>
                  <td class="text-center py-4 px-4 text-th-text-3">Restricted Areas</td>
                </tr>
                <tr class="border-b border-th-border-lt bg-th-bg-alt">
                  <td class="py-4 px-4 text-th-text-2">Government Contracts</td>
                  <td class="text-center py-4 px-4">
                    <span class="text-green-600 font-semibold">Direct Access</span>
                  </td>
                  <td class="text-center py-4 px-4 text-th-text-3">Through Sponsor</td>
                </tr>
                <tr class="border-b border-th-border-lt">
                  <td class="py-4 px-4 text-th-text-2">Family Sponsorship</td>
                  <td class="text-center py-4 px-4">
                    <span class="text-green-600 font-semibold">Unlimited</span>
                  </td>
                  <td class="text-center py-4 px-4 text-th-text-3">Limited by Salary</td>
                </tr>
                <tr class="border-b border-th-border-lt bg-th-bg-alt">
                  <td class="py-4 px-4 text-th-text-2">Exit/Re-entry</td>
                  <td class="text-center py-4 px-4">
                    <span class="text-green-600 font-semibold">Multiple Automatic</span>
                  </td>
                  <td class="text-center py-4 px-4 text-th-text-3">Requires Approval</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Trust Indicators -->
        <div class="text-center">
          <div class="inline-flex items-center space-x-8 flex-wrap justify-center gap-4">
            <div class="flex items-center">
              <svg class="w-8 h-8 text-green-600 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.1 0-1.99.9-1.99 2L3 20c0 1.1.89 2 1.99 2H19c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
              </svg>
              <div class="text-left">
                <div class="text-2xl font-bold text-th-text">2030</div>
                <div class="text-xs text-th-text-2">Valid Until</div>
              </div>
            </div>

            <div class="flex items-center">
              <svg class="w-8 h-8 text-amber-600 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <div class="text-left">
                <div class="text-2xl font-bold text-th-text">Verified</div>
                <div class="text-xs text-th-text-2">Government Approved</div>
              </div>
            </div>

            <div class="flex items-center">
              <svg class="w-8 h-8 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
              </svg>
              <div class="text-left">
                <div class="text-2xl font-bold text-th-text">Elite</div>
                <div class="text-xs text-th-text-2">Premium Status</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .border-gradient {
      background: linear-gradient(white, white) padding-box,
                  linear-gradient(135deg, #10b981 0%, #f59e0b 100%) border-box;
      border: 4px solid transparent;
    }
    @keyframes pulse {
      0%, 100% { opacity: 0.3; }
      50% { opacity: 0.5; }
    }
  `]
})
export class PremiumResidencyComponent {}