public with sharing class ChartExampleCls {
    @AuraEnabled(cacheable=true)
    public static List<DataSet> getAllAccountsByRating() {
        List<AggregateResult> result = [SELECT Count(Id) cnt, Rating FROM Account GROUP BY Rating LIMIT 10];
        List<DataSet> dataSet = new List<DataSet>();
        for (AggregateResult ar : result) {
            String status = (String) ar.get('Rating');
            Integer total = Integer.valueOf(ar.get('cnt'));
            dataSet.add(new DataSet(status, total));
        }
        return dataSet;
    }

    public class DataSet {
        @AuraEnabled
        public String label { get; set; }
        @AuraEnabled
        public Integer count { get; set; }

        public DataSet(String label, Integer count) {
            this.label = label;
            this.count = count;
        }
    }
}
