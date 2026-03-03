import { Component } from '@angular/core';
@Component({
  selector: 'app-global-reach',
  standalone: true,
  imports: [],
  template: `
    <section class="py-12 sm:py-20 bg-gradient-to-b from-surface-dark to-brand-darker text-white overflow-hidden">
      <div class="container mx-auto px-6">
        <!-- Section Header -->
        <div class="text-center mb-16">
          <div class="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-primary/20 to-accent/20 backdrop-blur-sm rounded-full border border-white/10 mb-6">
            <span class="text-sm font-medium bg-gradient-to-r from-primary-light to-accent bg-clip-text text-transparent">
              Global Expertise, Local Excellence
            </span>
          </div>
          <h2 class="text-4xl md:text-5xl font-bold mb-6">
            International Reach,
            <span class="bg-gradient-to-r from-primary-light to-accent bg-clip-text text-transparent">
              {{ ' ' }}Regional Mastery
            </span>
          </h2>
          <p class="text-xl text-th-text-3 max-w-3xl mx-auto">
            Bridging global best practices with deep understanding of GCC markets
          </p>
        </div>

        <!-- Interactive Map & Stats -->
        <div class="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <!-- Map Visual -->
          <div class="relative">
            <div class="aspect-w-16 aspect-h-12 bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-2xl p-8 border border-white/10">
              <!-- World Map SVG Simplified -->
              <svg viewBox="0 0 800 400" class="w-full h-full">
                <!-- Map Background -->
                <rect width="800" height="400" fill="transparent"/>

                <!-- Connection Lines -->
                <path d="M 400 200 Q 300 150, 200 180" stroke="url(#gradient1)" stroke-width="2" fill="none" opacity="0.6" class="animate-pulse"/>
                <path d="M 400 200 Q 500 150, 600 180" stroke="url(#gradient2)" stroke-width="2" fill="none" opacity="0.6" class="animate-pulse animation-delay-1000"/>
                <path d="M 400 200 Q 450 250, 500 300" stroke="url(#gradient3)" stroke-width="2" fill="none" opacity="0.6" class="animate-pulse animation-delay-2000"/>

                <!-- Gradient Definitions -->
                <defs>
                  <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:0" />
                    <stop offset="50%" style="stop-color:#3B82F6;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#3B82F6;stop-opacity:0" />
                  </linearGradient>
                  <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style="stop-color:#8B5CF6;stop-opacity:0" />
                    <stop offset="50%" style="stop-color:#8B5CF6;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#8B5CF6;stop-opacity:0" />
                  </linearGradient>
                  <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style="stop-color:#10B981;stop-opacity:0" />
                    <stop offset="50%" style="stop-color:#10B981;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#10B981;stop-opacity:0" />
                  </linearGradient>
                </defs>

                <!-- Location Markers -->
                <!-- Saudi Arabia (Center) -->
                <circle cx="400" cy="200" r="8" fill="#10B981" class="animate-ping"/>
                <circle cx="400" cy="200" r="5" fill="#10B981"/>
                <text x="400" y="190" text-anchor="middle" fill="white" font-size="12" font-weight="bold">KSA</text>

                <!-- Kuwait -->
                <circle cx="380" cy="190" r="5" fill="#3B82F6"/>
                <text x="380" y="180" text-anchor="middle" fill="white" font-size="10">Kuwait</text>

                <!-- Egypt -->
                <circle cx="350" cy="210" r="5" fill="#8B5CF6"/>
                <text x="350" y="230" text-anchor="middle" fill="white" font-size="10">Egypt</text>

                <!-- UK -->
                <circle cx="200" cy="180" r="5" fill="#F59E0B"/>
                <text x="200" y="170" text-anchor="middle" fill="white" font-size="10">UK</text>

                <!-- USA -->
                <circle cx="600" cy="180" r="5" fill="#EF4444"/>
                <text x="600" y="170" text-anchor="middle" fill="white" font-size="10">USA</text>
              </svg>
            </div>

            <!-- Floating Stats -->
            <div class="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-3 sm:p-4 shadow-xl">
              <div class="text-2xl sm:text-3xl font-bold">6</div>
              <div class="text-xs text-blue-100">Countries</div>
            </div>
            <div class="absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-3 sm:p-4 shadow-xl">
              <div class="text-2xl sm:text-3xl font-bold">4</div>
              <div class="text-xs text-purple-100">Time Zones</div>
            </div>
          </div>

          <!-- Regional Expertise -->
          <div class="space-y-6">
            <div class="bg-th-card/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-th-card/10 transition-all">
              <div class="flex items-start space-x-4">
                <div class="flex-shrink-0">
                  <div class="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                </div>
                <div class="flex-1">
                  <h3 class="text-lg font-semibold mb-2">Saudi Arabia & GCC</h3>
                  <p class="text-th-text-3 text-sm mb-3">Primary operations base with deep regulatory knowledge and Vision 2030 alignment</p>
                  <div class="flex flex-wrap gap-2">
                    <span class="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">SCE Certified</span>
                    <span class="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">17 Licensed Activities</span>
                    <span class="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">SAMA Compliant</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-th-card/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-th-card/10 transition-all">
              <div class="flex items-start space-x-4">
                <div class="flex-shrink-0">
                  <div class="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>
                    </svg>
                  </div>
                </div>
                <div class="flex-1">
                  <h3 class="text-lg font-semibold mb-2">International Education</h3>
                  <p class="text-th-text-3 text-sm mb-3">World-class credentials from leading institutions</p>
                  <div class="flex flex-wrap gap-2">
                    <span class="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">UK DBA (In Progress)</span>
                    <span class="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">UK MBA</span>
                    <span class="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">Stanford Certificate</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-th-card/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-th-card/10 transition-all">
              <div class="flex items-start space-x-4">
                <div class="flex-shrink-0">
                  <div class="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                    </svg>
                  </div>
                </div>
                <div class="flex-1">
                  <h3 class="text-lg font-semibold mb-2">Global Certifications</h3>
                  <p class="text-th-text-3 text-sm mb-3">Internationally recognized expertise across multiple domains</p>
                  <div class="flex flex-wrap gap-2">
                    <span class="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">PgMP®</span>
                    <span class="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">RCDD®</span>
                    <span class="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">CISM®</span>
                    <span class="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">AOS</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Professional Network -->
        <div class="bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
          <h3 class="text-2xl font-bold mb-8 text-center">Professional Network & Memberships</h3>

          <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
            <div class="text-center">
              <div class="w-16 h-16 mx-auto bg-th-card/10 rounded-lg flex items-center justify-center mb-2">
                <span class="text-2xl font-bold text-blue-400">PMI</span>
              </div>
              <div class="text-xs text-th-text-3">Project Mgmt</div>
            </div>

            <div class="text-center">
              <div class="w-16 h-16 mx-auto bg-th-card/10 rounded-lg flex items-center justify-center mb-2">
                <span class="text-2xl font-bold text-green-400">ISACA</span>
              </div>
              <div class="text-xs text-th-text-3">Security</div>
            </div>

            <div class="text-center">
              <div class="w-16 h-16 mx-auto bg-th-card/10 rounded-lg flex items-center justify-center mb-2">
                <span class="text-2xl font-bold text-purple-400">CMI</span>
              </div>
              <div class="text-xs text-th-text-3">Management</div>
            </div>

            <div class="text-center">
              <div class="w-16 h-16 mx-auto bg-th-card/10 rounded-lg flex items-center justify-center mb-2">
                <span class="text-2xl font-bold text-yellow-400">SCE</span>
              </div>
              <div class="text-xs text-th-text-3">Saudi Eng.</div>
            </div>

            <div class="text-center">
              <div class="w-16 h-16 mx-auto bg-th-card/10 rounded-lg flex items-center justify-center mb-2">
                <span class="text-2xl font-bold text-orange-400">KES</span>
              </div>
              <div class="text-xs text-th-text-3">Kuwait Eng.</div>
            </div>

            <div class="text-center">
              <div class="w-16 h-16 mx-auto bg-th-card/10 rounded-lg flex items-center justify-center mb-2">
                <span class="text-2xl font-bold text-red-400">AES</span>
              </div>
              <div class="text-xs text-th-text-3">Arab Eng.</div>
            </div>

            <div class="text-center">
              <div class="w-16 h-16 mx-auto bg-th-card/10 rounded-lg flex items-center justify-center mb-2">
                <span class="text-2xl font-bold text-cyan-400">AMBA</span>
              </div>
              <div class="text-xs text-th-text-3">MBA Assoc.</div>
            </div>

            <div class="text-center">
              <div class="w-16 h-16 mx-auto bg-th-card/10 rounded-lg flex items-center justify-center mb-2">
                <span class="text-2xl font-bold text-pink-400">ESQ</span>
              </div>
              <div class="text-xs text-th-text-3">Quality</div>
            </div>
          </div>

          <div class="mt-8 text-center">
            <p class="text-th-text-3">
              Connected with <span class="text-2xl font-bold text-white">10,000+</span> professionals globally
              through premium associations and elite certification bodies
            </p>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .animation-delay-1000 {
      animation-delay: 1s;
    }
    .animation-delay-2000 {
      animation-delay: 2s;
    }
  `]
})
export class GlobalReachComponent {}