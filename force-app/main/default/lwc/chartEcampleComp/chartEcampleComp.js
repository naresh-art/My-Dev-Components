import { LightningElement, wire, track } from 'lwc';
import chartjs from '@salesforce/resourceUrl/ChartJs';
import { loadScript } from 'lightning/platformResourceLoader';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getAllAccountsByRating from '@salesforce/apex/ChartExampleCls.getAllAccountsByRating';

export default class ChartWithTable extends LightningElement {
    @track chartData = []; // Data for the table
    chart;
    chartjsInitialized = false;
    chartDataQueue = [];
    error;

    // Define columns for the data table
    columns = [
        { label: 'Rating', fieldName: 'label', type: 'text' },
        { label: 'Count', fieldName: 'count', type: 'number' }
    ];

    config = {
        type: 'doughnut',
        data: {
            datasets: [
                {
                    data: [],
                    backgroundColor: [
                        'rgb(255,99,132)',
                        'rgb(255,159,64)',
                        'rgb(255,205,86)',
                        'rgb(75,192,192)',
                    ],
                    label: 'Dataset 1'
                }
            ],
            labels: []
        },
        options: {
            responsive: true,
            legend: {
                position: 'right'
            },
            animation: {
                animateScale: true,
                animateRotate: true
            }
        }
    };

    // Fetch data from Apex
    @wire(getAllAccountsByRating)
    accounts({ error, data }) {
        if (data) {
            this.chartData = data.map(item => ({ label: item.label, count: item.count }));

            // Queue data for the chart if the library isn't initialized yet
            data.forEach(item => {
                if (this.chartjsInitialized) {
                    this.updateChart(item.count, item.label);
                } else {
                    this.chartDataQueue.push(item);
                }
            });
        } else if (error) {
            this.error = error;
            this.showErrorToast(error);
        }
    }

    // Rendered Callback to load Chart.js and initialize the chart
    renderedCallback() {
        if (this.chartjsInitialized) {
            return;
        }

        // Load Chart.js
        loadScript(this, chartjs)
            .then(() => {
                const canvas = this.template.querySelector('canvas.donut');
                
                if (canvas) {
                    const ctx = canvas.getContext('2d');
                    this.chart = new window.Chart(ctx, this.config);
                    this.chartjsInitialized = true;

                    // Process any queued data
                    this.processChartQueue();
                } else {
                    console.error('Canvas element not found');
                }
            })
            .catch(error => {
                this.showErrorToast(error);
            });
    }

    // Update chart with new data
    updateChart(count, label) {
        if (this.chart) {
            this.chart.data.labels.push(label);
            this.chart.data.datasets.forEach((dataset) => {
                dataset.data.push(count);
            });
            this.chart.update();
        }
    }

    // Process any chart data that was queued before the chart was initialized
    processChartQueue() {
        if (this.chartDataQueue.length > 0) {
            this.chartDataQueue.forEach(item => {
                this.updateChart(item.count, item.label);
            });
            this.chartDataQueue = [];
        }
    }

    // Show toast error message
    showErrorToast(error) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Error',
                message: error.message || 'Unknown error',
                variant: 'error',
            })
        );
    }
}
