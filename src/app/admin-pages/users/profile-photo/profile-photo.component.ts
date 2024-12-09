// profile-photo.component.ts
import {Component, OnInit, Input, EventEmitter, Output, OnChanges, SimpleChanges} from '@angular/core'
import {UserData, User} from '../../../@core/interfaces/common/users'
import {NbToastrService} from '@nebular/theme'

@Component({
  selector: 'ngx-profile-photo',
  templateUrl: './profile-photo.component.html',
  styleUrls: ['./profile-photo.component.scss']
})
export class ProfilePhotoComponent implements OnChanges {
  @Input() userId: string = '' // User ID
  @Input() firstName: string = '' // First name of the user
  @Input() lastName: string = '' // Last name of the user
  @Input() initialProfilePic: string | null = null // Input for initial picture
  @Output() profilePicUpdated = new EventEmitter<string>() // Emit updated picture URL

  currentProfilePic: string | null = null

  constructor(private usersService: UserData, private toasterService: NbToastrService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.initialProfilePic && changes.initialProfilePic.currentValue !== this.currentProfilePic) {
      this.currentProfilePic = changes.initialProfilePic.currentValue
    }
  }

  onFileChange(event) {
    if (event.target.files && event.target.files[0]) {
      const fileSize = event.target.files[0].size / 1000000 // in MB
      // Allow file size less than 200mb
      if (fileSize < 2) {
        this.uploadImage(event.target.files[0])
      } else {
        this.toasterService.danger('Image size should be less than 2mb', 'File size exceeded!')
      }
    }
  }

  getUserInitials(): string {
    const initials = (this.firstName[0] || '') + (this.lastName[0] || '')
    return initials.toUpperCase()
  }

  uploadImage(file: File): void {
    this.usersService.updateProfileImage(this.userId, file).subscribe({
      next: res => {
        this.currentProfilePic = res.profileImage // Update displayed picture
        this.profilePicUpdated.emit(res.profileImage) // Notify parent component
        this.toasterService.success('Profile picture updated successfully', 'Success!')
      },
      error: err => {
        this.toasterService.danger('Failed to update profile picture', 'Error!')
      }
    })
  }
}
