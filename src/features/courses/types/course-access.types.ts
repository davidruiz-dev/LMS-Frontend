export interface CourseAccess {
  exists: boolean
  canView: boolean
  canEdit: boolean
  canEnrollUsers: boolean
  canAccessContent: boolean
  canEditModules: boolean
  isOwner: boolean
}
