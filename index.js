var correlation = function(){
       
        this.findConnection=function(series11, series22, tries, start, end){

            var series1 = series11;
           var  series2=series22;
             if(typeof tries == "undefined"){
                    var tries = 10;
                }

                if(typeof start == "undefined"){
                    var start = 0;
                }

                if(typeof end == "undefined"){
                    var end = (series1.length); //console.log(end);
                }
              series1= series1.slice(start,end);
                series2= series2.slice(start,end);

                var highestCorr = 0;
                var whichRel = "diff";
                var bestOffset = 1;
            for(t= 1; t<= tries; t++ ){
                var off= parseInt(t);
                var theRes = this.determineCorr(series1, series2,off);
                if(theRes['by'] > highestCorr){
                    highestCorr= theRes['by'];
                    whichRel= theRes['results'];
                    bestOffset = off;

                }
               
            }

             return {"offset":bestOffset, "rel":whichRel, "correlation":highestCorr};
        }

        this.determineCorr= function (series1, series2, offset){

          //  console.log('hmm');
            if(typeof offset == "undefined"){
                    offset = 1;
                }
            //generate an array of when what
            var allCor= [];
            for( k in series1){
               // console.log('going');
                if(typeof series2[k] == "undefined"){
                    break;
                }


                k = parseInt(k);
                var n = k+offset;

                if(typeof series1[n] == "undefined"){
                    break;
                }
                var before1= series1[k];
                var after1 = series1[n];

                 var before2= series2[k];
                var after2 = series2[n];

                var toAdd = this.whenWhat(before1, after1, before2, after2);
                allCor.push(toAdd);


            }
           var result1 = this.getCorrelation(allCor);
            return result1;
        }

       this.whenWhat= function( beforeF1, afterF1, beforeF2, afterF2){

            var whatHappend1 = "lost";
            var whatHappend2 = "lost";
            //
            if(beforeF1 >= afterF1){
                 whatHappend1 = "won";
                //factor 1 increased or stayed same
            }
            else{
                //factor 1 decreased
                 whatHappend1 = "lost";
            }

             if(beforeF2 >= afterF2){
                 whatHappend2 = "won";
                //factor 2 increased or stayed same
            }
            else{
                 whatHappend2 = "lost";
                //factor 1 decreased
            }

            return [whatHappend1, whatHappend2];

        }

        //66 percent correlation
      //  [['won', 'won'],['won', 'won'],['won', 'lost']]

     this.getCorrelation= function(arr1){
            var results = [];
            for(i in arr1){

                if(arr1[i][0] == arr1[i][1]){
                    results.push("same");
                }
                else{

                      results.push("diff");
                }
            }
            var sameNum=0;
            var diffNum = 0;
            var all = results.length;

            for( j in results){
                if(results[j]=="same"){
                    sameNum= sameNum +1;
                }
                else{
                    diffNum = diffNum+1;
                }
            }

            if(diffNum>= sameNum){
                return {results:"diff", "by":(diffNum/all)}
            }

            else{
                return {results:"same", "by":(sameNum/all)}
            }
        }
}
