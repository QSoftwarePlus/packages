declare global {
  namespace PrismaJson {
    type RequestForProposalTags = string[]

    type VisibleFilters = string[]

    type Columns = string[]

    type TopicSubscriptionProtocols = Array<'email' | 'push'>

    type NewsRequestDestinations = string[]

    type AffectedCoverages = string[]

    type JobProgress = {
      operation:
        | 'scrape_sinister_files'
        | 'scrape_sinister_documents'
        | 'scrape_report_inspections'
        | 'scrape_documentation'
        | 'scrape_policyholder_inspections'
        | 'scrape_sinister_expert_appraisals'
      doneAt: Date
    }[]
  }
}

export {}
