<script>
import { Pie } from "vue-chartjs";

export default {
  extends: Pie,
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
        maintainAspectRatio: false
      }
    );
  }
};
</script>
