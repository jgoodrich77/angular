'use strict';

angular
.module('auditpagesApp')
.service('$accountGroups', function (Group, Plan, BillingSchedule, BillingMethod) {

  function fetchSubscribed() {
    return Group.listSubscribed().$promise;
  }
  function fetchServicePlans() {
    return Plan.listActive().$promise;
  }
  function fetchBillingSchedules() {
    return BillingSchedule.listActive().$promise;
  }
  function fetchBillingMethods() {
    return BillingMethod.listActive().$promise;
  }
  function fetchFormDependencies() {
      var tServicePlans, tBillingSchedules;

    return fetchServicePlans()
      .then(function (plans) {
        tServicePlans = plans;
        return fetchBillingSchedules();
      })
      .then(function (billingSchedules) {
        tBillingSchedules = billingSchedules;
        return fetchBillingMethods();
      })
      .then(function (billingMethods) {
        return {
          servicePlans: tServicePlans,
          billingSchedules: tBillingSchedules,
          billingMethods: billingMethods
        };
      });
  }
  function editableRole(r) {
    return !!r && r !== 'viewer';
  }

  function findAndTest(arr, arrItem, arrProp, test) {
    if(!arr || !arr.length || !arrItem || !angular.isFunction(test)) return false;

    var match = false;

    arr.every(function (possible) {
      var found = false;
      if(possible[arrProp] === arrItem) {
        match = test(possible);
        found = true;
      }

      return !found;
    });

    return match;
  }

  function findDefault(arr, arrProp, keepProp) {
    var item = false;

    arr.every(function (T) {
      if(!!T[arrProp]) {
        item = !!keepProp ? T[keepProp] : T;
      }
      return !item;
    });

    return item;
  }

  function findDefaultPlan (ap) {
    return findDefault(ap, 'groupDefault', '_id');
  }
  function findDefaultBillingSchedule (bs) {
    return findDefault(bs, 'groupDefault', '_id');
  }
  function findDefaultBillingMethod (bm) {
    return findDefault(bm, 'groupDefault', '_id');
  }
  function isPlanBillable (p, ap) {
    return findAndTest(ap, p, '_id', function (itm) {
      return itm.monthlyCost > 0;
    });
  }
  function isBillableCC (bmm, abm) {
    return findAndTest(abm, bmm, '_id', function (itm) {
      return itm.adapter.factoryClass === 'credit-card';
    });
  }
  function isBillablePaypal (bmm, abm) {
    return findAndTest(abm, bmm, '_id', function (itm) {
      return itm.adapter.factoryClass === 'paypal';
    });
  }
  function isPaypalAgreement (bm, abm) {
    return isBillablePaypal (bm.method, abm) &&
      !!bm.detail.ppAggreementId &&
      !!bm.detail.ppAccountHolder;
  }
  function modelFormReset(scope, master, modelProp, loadingProp, loadErrorProp, servicePlansProp, billingSchedulesProp, billingMethodsProp) {
    return function(reloadDeps) {
      scope[modelProp] = angular.copy(scope.master = master); // don't taint master

      if(reloadDeps) {
        scope[loadingProp] = true;
        fetchFormDependencies()
          .then(function (deps) {
            scope[servicePlansProp]     = deps.servicePlans;
            scope[billingSchedulesProp] = deps.billingSchedules;
            scope[billingMethodsProp]   = deps.billingMethods;

            var
            defaultPlan = findDefaultPlan(deps.servicePlans),
            defaultSched = findDefaultBillingSchedule(deps.billingSchedules),
            defaultMethod = findDefaultBillingMethod(deps.billingMethods);

            if(!!defaultPlan && !scope[modelProp].servicePlan) {
              scope[modelProp].servicePlan = defaultPlan;
            }

            if(!!defaultSched && !scope[modelProp].billingSchedule) {
              scope[modelProp].billingSchedule = defaultSched;
            }

            if(!!defaultMethod && (!scope[modelProp].billingMethod||!scope[modelProp].billingMethod.method)) {
              if(!scope[modelProp].billingMethod) {
                scope[modelProp].billingMethod = {};
              }

              scope[modelProp].billingMethod.method = defaultMethod;
            }
          })
          .catch(function (error) {
            scope[loadErrorProp] = error;
            return error;
          })
          .finally(function(){
            scope[loadingProp] = false;
          });
      }
    }
  }

  function modelFormSave(scope, master, modelProp, savingProp, saveErrorProp, servicePlansProp, billingSchedulesProp, billingMethodsProp) {
    return function() {
      var model = scope[modelProp];

      scope[savingProp] = true;
      // fetchFormDependencies()
      //   .then(function (deps) {
      //     scope[servicePlansProp]     = deps.servicePlans;
      //     scope[billingSchedulesProp] = deps.billingSchedules;
      //     scope[billingMethodsProp]   = deps.billingMethods;
      //   })
      //   .catch(function (error) {
      //     scope[loadErrorProp] = error;
      //     return error;
      //   })
      //   .finally(function(){
      //     scope[loadingProp] = false;
      //   });
    }
  }

  return {
    subscribed:        fetchSubscribed,
    servicePlans:      fetchServicePlans,
    billingSchedules:  fetchBillingSchedules,
    billingMethods:    fetchBillingMethods,
    formDependencies:  fetchFormDependencies,
    isBillable:        isPlanBillable,
    isBillableCC:      isBillableCC,
    isBillablePaypal:  isBillablePaypal,
    isPaypalAgreement: isPaypalAgreement,
    canEdit:           editableRole,
    formReset:         modelFormReset,
    formSave:          modelFormSave
  };
});
