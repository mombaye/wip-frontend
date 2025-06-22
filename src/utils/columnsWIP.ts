// src/utils/columnsWIP.ts
export const wipColumnGroups = [
  {
    group: "By PM",
    color: "bg-green-100 text-green-900 border-x-2 border-green-200",
    columns: [
      { label: "Nr Crt", field: "nr_crt", sticky: true },
      { label: "Project Code", field: "project_code", sticky: true },
      { label: "Client", field: "client", sticky: true },
      { label: "Location - description of the project", field: "location_description" },
      { label: "Business line", field: "business_line" },
      { label: "Multiple business line", field: "multiple_business_line" },
      { label: "Site construction", field: "site_construction" },
      { label: "Fiber Optic", field: "fiber_optic" },
      { label: "Energy", field: "energy" },
      { label: "Managed Services", field: "managed_services" },
      { label: "Installations", field: "installations" },
      { label: "PO number", field: "po_number" },
      { label: "Date de PO", field: "po_date" },
      { label: "Start date of the project", field: "start_date" },
      { label: "Estimated date of completion", field: "estimated_completion_date" },
      { label: "Initial Value of project/PO", field: "initial_value_po" },
      { label: "Final Value of project/PO", field: "final_value_po_currency" },
      { label: "Currency", field: "po_currency" },
      { label: "Foreign exchange end of reporting period", field: "exchange_rate" },
      { label: "Final Value of project / PO - in local currency", field: "final_value_local_currency", calculated: true },
      { label: "Status", field: "status" },
      { label: "Cancelled / Bloked Amount - In local Currency", field: "cancelled_amount_local" },
      { label: "Reason for Cancelled / Bloked PO", field: "cancel_reason" },
      { label: "Estimated Gross margin", field: "estimated_margin" },
    ]
  },
  {
    group: "Automatic",
    color: "bg-orange-100 text-orange-900 border-x-2 border-orange-200",
    columns: [
      { label: "Estimated profit", field: "estimated_profit", calculated: true },
      { label: "Estimated costs", field: "estimated_costs", calculated: true },
      { label: "Degree of completion", field: "degree_of_completion", calculated: true },
      { label: "Revenue based on the degree of completion", field: "revenue_completion", calculated: true },
      { label: "FAE - Invoices to be issued", field: "fae", calculated: true },
      { label: "PCA - Deferred income", field: "pca", calculated: true },
      { label: "Provision for losses", field: "provision_for_losses" },
    ]
  },
  {
    group: "Finance",
    color: "bg-blue-100 text-blue-900 border-x-2 border-blue-200",
    columns: [
      { label: "Invoices issued (sum of multiple invoices) - local currency (Excluding VAT)", field: "invoices_local_ex_vat", calculated: true },
      { label: "Currency of PO", field: "invoice_currency" },
      { label: "Total expenses", field: "total_expenses", calculated: true },
      { label: "Deferred Cost", field: "deferred_cost" },
      { label: "PV d'acceptaion", field: "pv_acceptance" },
    ]
  }
];



export const wipColumnsFlat = wipColumnGroups.flatMap(g => g.columns);
export const editableFields = wipColumnsFlat.filter(c => !c.calculated).map(c => c.field);