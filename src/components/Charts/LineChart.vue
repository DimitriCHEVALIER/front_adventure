<script>
import { Line } from "vue-chartjs";

export default {
  extends: Line,
  props: {
    labels: {
      type: Array,
      required: true,
      default: () => []
    },
    datasets: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  mounted() {
    this.renderChart(
      {
        labels: this.labels,
        datasets: this.datasets
      },
      {
        responsive: true,
        maintainAspectRatio: false,
        title: {
          display: true,
          text: "7 last days chart (vs USD)"
        }
      }
    );
  }
};
</script>
