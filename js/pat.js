$(document).ready(function(){
    setupPolicyAnalysisPage();
});

function errorMessage(msg) {
    var elem = $('#message');
    if(!msg) return;

    var data = $.parseJSON(msg);

    var p = $('<ol/>')
    $.each(data, function(i, v){
        p.append('<li>' + v + '</li>');
    });

    elem.wrapInner(p);
    elem.show();
}

function setupPolicyAnalysisPage() {
    var analyze = $("#analyze");

    if(analyze) {  // if we found the "analyze" button
        analyze.click(function(){
            var dialog = $('#__dialog');
            var body = $('#modal_body');

            dialog.modal({show: true, backdrop: 'static', keyboard: false});
            body.html("Submitting request...");

            // post request and get the job id
            var form = $('#policy_analysis_form');
            var url = form.attr('action') + '?' + form.serialize();

            var jobId = null ;
            $.get(url, function(data){
                if(data && data.job_id) {
                    jobId = data.job_id;

                    body.html("The job is submitted, Job ID: " + jobId);
                } else {
                    errorMessage(data);
                    dialog.modal('hide');
                }
            }).fail(function(){
                jobId = null;
                body.html("Failed to submit your request, please try again later...");
            });

            if(!jobId) return false;

            var intervalId = null;
            setTimeout(function(){
                intervalId = timelyLoader(jobId, 3000);
            }, 2000);

            dialog.on('hidden.bs.modal', function () {
                clearInterval(intervalId);
            })

            return false;
        });
    }
}

function timelyLoader(jobId, frequency) {
    var load = function(){
        var result ;
        $.get('/policy_analysis/update?job_id=' + jobId,
            function(data){
                result = data;
            });

        return result;
    };

    var f = function() {
        var data = load();
        $('#modal_body').html(data);

        if(data) {
            alert("xx");
        }
    }

    return setInterval(f, frequency);
}