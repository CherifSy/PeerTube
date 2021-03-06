import { Component, OnInit } from '@angular/core'
import { NotificationsService } from 'angular2-notifications'
import { SortMeta } from 'primeng/primeng'
import { Job } from '../../../../../../shared/index'
import { JobState } from '../../../../../../shared/models'
import { RestPagination, RestTable } from '../../../shared'
import { viewportHeight } from '../../../shared/misc/utils'
import { JobService } from '../shared'
import { RestExtractor } from '../../../shared/rest/rest-extractor.service'

@Component({
  selector: 'my-jobs-list',
  templateUrl: './jobs-list.component.html',
  styleUrls: [ './jobs-list.component.scss' ]
})
export class JobsListComponent extends RestTable implements OnInit {
  private static JOB_STATE_LOCAL_STORAGE_STATE = 'jobs-list-state'

  jobState: JobState = 'inactive'
  jobStates: JobState[] = [ 'active', 'complete', 'failed', 'inactive', 'delayed' ]
  jobs: Job[] = []
  totalRecords: number
  rowsPerPage = 10
  sort: SortMeta = { field: 'createdAt', order: -1 }
  pagination: RestPagination = { count: this.rowsPerPage, start: 0 }
  scrollHeight = ''

  constructor (
    private notificationsService: NotificationsService,
    private restExtractor: RestExtractor,
    private jobsService: JobService
  ) {
    super()
  }

  ngOnInit () {
    // 380 -> headers + footer...
    this.scrollHeight = (viewportHeight() - 380) + 'px'

    this.loadJobState()
    this.loadSort()
  }

  onJobStateChanged () {
    this.loadData()
    this.saveJobState()
  }

  protected loadData () {
    this.jobsService
      .getJobs(this.jobState, this.pagination, this.sort)
      .subscribe(
        resultList => {
          this.jobs = resultList.data
          this.totalRecords = resultList.total
        },

        err => this.notificationsService.error('Error', err.message)
      )
  }

  private loadJobState () {
    const result = localStorage.getItem(JobsListComponent.JOB_STATE_LOCAL_STORAGE_STATE)

    if (result) this.jobState = result as JobState
  }

  private saveJobState () {
    localStorage.setItem(JobsListComponent.JOB_STATE_LOCAL_STORAGE_STATE, this.jobState)
  }
}
