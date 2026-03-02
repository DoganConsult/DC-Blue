import { Component, inject, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../../core/services/admin-api.service';
import { TeamMember } from '../../../core/models/admin.models';

@Component({
  selector: 'admin-team-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="mb-6">
      <h2 class="text-xl font-bold mb-1">Team Members</h2>
      <p class="text-th-text-3 text-sm mb-4">Create and manage Dogan Consult employees and admins. They must change their password on first login.</p>
    </div>

    <div class="bg-th-card border border-th-border rounded-xl p-6 mb-6">
      <h3 class="text-sm font-semibold mb-4 text-th-text-3">Create Team Member</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input [(ngModel)]="newUserForm.name" placeholder="Full name"
               class="bg-th-bg-tert border border-th-border-dk text-th-text placeholder-th-text-3 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
        <input [(ngModel)]="newUserForm.email" placeholder="Email" type="email"
               class="bg-th-bg-tert border border-th-border-dk text-th-text placeholder-th-text-3 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
        <input [(ngModel)]="newUserForm.password" placeholder="Initial password (min 8 chars)" type="text"
               class="bg-th-bg-tert border border-th-border-dk text-th-text placeholder-th-text-3 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
        <select [(ngModel)]="newUserForm.role"
                class="bg-th-bg-tert border border-th-border-dk text-th-text rounded-xl px-4 py-3 text-sm focus:outline-none">
          <option value="employee">Employee</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      @if (createUserError()) {
        <div class="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm mb-4">{{ createUserError() }}</div>
      }
      @if (createUserSuccess()) {
        <div class="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-emerald-700 text-sm mb-4">{{ createUserSuccess() }}</div>
      }
      <button (click)="createUser()" [disabled]="createUserLoading()"
              class="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:opacity-90 transition disabled:opacity-50">
        @if (createUserLoading()) { Creating... } @else { Create User }
      </button>
    </div>

    <div class="bg-th-card border border-th-border rounded-xl overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-th-border text-th-text-3">
            <th class="text-left font-medium px-4 py-3">Name</th>
            <th class="text-left font-medium px-4 py-3">Email</th>
            <th class="text-left font-medium px-4 py-3">Role</th>
            <th class="text-left font-medium px-4 py-3">Status</th>
            <th class="text-left font-medium px-4 py-3">Created</th>
            <th class="text-left font-medium px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          @for (u of teamMembers(); track u.id) {
            <tr class="border-b border-th-border/50 hover:bg-th-bg-tert/50">
              <td class="px-4 py-3 font-medium">{{ u.name || '—' }}</td>
              <td class="px-4 py-3 text-th-text-3">{{ u.email }}</td>
              <td class="px-4 py-3">
                @if (editingUser()?.id === u.id) {
                  <select [(ngModel)]="editRole" class="bg-th-bg-tert border border-th-border-dk text-th-text rounded-lg px-2 py-1 text-xs focus:outline-none">
                    <option value="employee">employee</option>
                    <option value="admin">admin</option>
                  </select>
                } @else if (u.role === 'admin') {
                  <span class="px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">admin</span>
                } @else {
                  <span class="px-2.5 py-1 rounded-full text-xs font-medium bg-sky-100 text-sky-700">employee</span>
                }
              </td>
              <td class="px-4 py-3">
                @if (u.must_change_password) {
                  <span class="text-amber-600 text-xs">Pending password change</span>
                } @else {
                  <span class="text-emerald-600 text-xs">Active</span>
                }
              </td>
              <td class="px-4 py-3 text-th-text-3 text-xs">{{ u.created_at | date:'mediumDate' }}</td>
              <td class="px-4 py-3">
                @if (editingUser()?.id === u.id) {
                  <button (click)="saveEdit(u.id)" class="mr-1 px-2 py-1 rounded bg-emerald-600/80 text-white text-xs hover:bg-emerald-600 transition">Save</button>
                  <button (click)="cancelEdit()" class="px-2 py-1 rounded bg-th-bg-tert text-th-text-3 text-xs hover:bg-th-bg-tert transition">Cancel</button>
                } @else {
                  <button (click)="startEdit(u)" class="mr-1 px-2 py-1 rounded bg-th-bg-tert text-th-text-3 text-xs hover:text-th-text transition">Edit</button>
                  <button (click)="resetPassword(u)" [disabled]="resetLoading()"
                          class="mr-1 px-2 py-1 rounded bg-amber-600/80 text-white text-xs hover:bg-amber-600 transition disabled:opacity-50">Reset PW</button>
                }
              </td>
            </tr>
          } @empty {
            <tr><td colspan="6" class="px-4 py-10 text-center text-th-text-3">No team members yet</td></tr>
          }
        </tbody>
      </table>
    </div>

    <!-- Reset Password Modal -->
    @if (tempPassword()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-th-bg-inv/70 p-4" (click)="tempPassword.set(null)">
        <div class="bg-th-card border border-th-border-dk rounded-xl p-6 max-w-md w-full shadow-xl" (click)="$event.stopPropagation()">
          <h3 class="text-lg font-bold mb-2">Password Reset</h3>
          <p class="text-th-text-3 text-sm mb-4">New temporary password (user must change on next login):</p>
          <div class="flex items-center gap-2">
            <input [value]="tempPassword()!" readonly
                   class="flex-1 bg-th-bg-tert text-th-text font-mono text-sm px-3 py-2 rounded-lg border border-th-border-dk" />
            <button (click)="copyTempPassword()" class="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition">Copy</button>
          </div>
          <button (click)="tempPassword.set(null)" class="mt-4 w-full py-2 rounded-lg border border-th-border-dk text-th-text-3 text-sm hover:bg-th-bg-tert transition">Close</button>
        </div>
      </div>
    }
  `,
})
export class AdminTeamManagementComponent {
  private api = inject(AdminApiService);

  teamMembers = signal<TeamMember[]>([]);
  newUserForm = { name: '', email: '', password: '', role: 'employee' };
  createUserLoading = signal(false);
  createUserError = signal<string | null>(null);
  createUserSuccess = signal<string | null>(null);

  editingUser = signal<TeamMember | null>(null);
  editRole = 'employee';
  resetLoading = signal(false);
  tempPassword = signal<string | null>(null);

  sessionExpired = output<void>();

  ngOnInit() {
    this.loadTeamMembers();
  }

  loadTeamMembers() {
    this.api.getUsers().subscribe({
      next: (r) => this.teamMembers.set(r.data),
      error: (err) => { if (err.status === 401) this.sessionExpired.emit(); },
    });
  }

  createUser() {
    const { name, email, password, role } = this.newUserForm;
    if (!email || !password || password.length < 8) {
      this.createUserError.set('Email and password (min 8 chars) are required');
      return;
    }
    this.createUserLoading.set(true);
    this.createUserError.set(null);
    this.createUserSuccess.set(null);
    this.api.createUser({ email, password, name, role }).subscribe({
      next: (r) => {
        this.createUserLoading.set(false);
        this.createUserSuccess.set(`User ${r.user.email} created. They must change password on first login.`);
        this.newUserForm = { name: '', email: '', password: '', role: 'employee' };
        this.loadTeamMembers();
      },
      error: (e) => {
        this.createUserLoading.set(false);
        this.createUserError.set(e.error?.error || 'Failed to create user');
      },
    });
  }

  startEdit(u: TeamMember) {
    this.editingUser.set(u);
    this.editRole = u.role;
  }

  cancelEdit() { this.editingUser.set(null); }

  saveEdit(id: string) {
    this.api.updateUser(id, { role: this.editRole }).subscribe({
      next: () => { this.editingUser.set(null); this.loadTeamMembers(); },
      error: (e) => this.createUserError.set(e.error?.error || 'Failed to update user'),
    });
  }

  resetPassword(u: TeamMember) {
    this.resetLoading.set(true);
    this.api.resetUserPassword(u.id).subscribe({
      next: (r) => { this.resetLoading.set(false); this.tempPassword.set(r.temp_password); this.loadTeamMembers(); },
      error: (e) => { this.resetLoading.set(false); this.createUserError.set(e.error?.error || 'Failed to reset password'); },
    });
  }

  copyTempPassword() {
    const pw = this.tempPassword();
    if (pw && typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(pw);
    }
  }
}
